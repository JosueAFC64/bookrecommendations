from sqlalchemy.orm import Session
from sqlalchemy import func, and_, desc
from typing import List, Dict, Tuple
import math
from collections import defaultdict

from models import User, Book, Review, ReadingHistory, UserPreference
from schemas import RecommendationResponse, BookResponse

class RecommendationEngine:
    """Sistema de recomendaciones de libros"""
    
    def get_genre_recommendations(self, db: Session, user_id: int, limit: int = 10) -> List[RecommendationResponse]:
        """Recomendaciones basadas en géneros preferidos"""
        # Obtener preferencias del usuario
        preferences = db.query(UserPreference).filter(
            UserPreference.user_id == user_id
        ).all()
        
        if not preferences:
            # Si no hay preferencias, inferirlas de la historia de lectura
            self._infer_preferences_from_history(db, user_id)
            preferences = db.query(UserPreference).filter(
                UserPreference.user_id == user_id
            ).all()
        
        recommendations = []
        
        # Obtener libros que el usuario no ha leído
        read_books_query = db.query(ReadingHistory.book_id).filter(
            ReadingHistory.user_id == user_id
        ).all()
        read_books_ids = [book_id for (book_id,) in read_books_query]
        
        for pref in preferences:
            if pref.preference_score > 0:  # Solo considerar géneros con preferencia positiva
                books = db.query(Book).filter(
                    and_(
                        Book.genre == pref.genre,
                        ~Book.id.in_(read_books_ids),
                        Book.average_rating >= 3.5  # Solo libros bien valorados
                    )
                ).order_by(desc(Book.average_rating)).limit(5).all()
                
                for book in books:
                    score = pref.preference_score * (book.average_rating / 5.0)
                    recommendations.append(RecommendationResponse(
                        book=BookResponse.from_orm(book),
                        score=score,
                        reason=f"Recomendado por tu interés en {pref.genre}"
                    ))
        
        # Ordenar recomendaciones por puntuación
        recommendations.sort(key=lambda x: x.score, reverse=True)
        return recommendations[:limit]
    
    def get_author_recommendations(self, db: Session, user_id: int, limit: int = 10) -> List[RecommendationResponse]:
        """Recomendaciones basadas en autores favoritos"""
        # Encontrar autores favoritos del usuario
        favorite_authors = db.query(
            Book.author,
            func.avg(Review.rating).label('avg_rating'),
            func.count(Review.id).label('review_count')
        ).join(Review).filter(
            Review.user_id == user_id
        ).group_by(Book.author).having(
            and_(
                func.avg(Review.rating) >= 4.0,
                func.count(Review.id) >= 1
            )
        ).all()
        
        recommendations = []
        
        # Obtener libros de estos autores que el usuario no ha leído
        read_books_query = db.query(ReadingHistory.book_id).filter(
            ReadingHistory.user_id == user_id
        ).all()
        read_books_ids = [book_id for (book_id,) in read_books_query]
        
        for author_data in favorite_authors:
            author, avg_rating, review_count = author_data
            
            # Obtener otros libros del autor
            books = db.query(Book).filter(
                and_(
                    Book.author == author,
                    ~Book.id.in_(read_books_ids),
                    Book.average_rating >= 3.0
                )
            ).order_by(desc(Book.average_rating)).limit(3).all()
            
            for book in books:
                score = (float(avg_rating) / 5.0) * (book.average_rating / 5.0)
                recommendations.append(RecommendationResponse(
                    book=BookResponse.from_orm(book),
                    score=score,
                    reason=f"Recomendado porque te gusta {author}"
                ))
        
        recommendations.sort(key=lambda x: x.score, reverse=True)
        return recommendations[:limit]
    
    def get_collaborative_recommendations(self, db: Session, user_id: int, limit: int = 10) -> List[RecommendationResponse]:
        """Recomendaciones colaborativas usando correlación de Pearson"""
        # Obtener calificaciones del usuario
        user_ratings = self._get_user_ratings(db, user_id)
        if not user_ratings:
            return []
        
        # Encontrar usuarios similares
        similar_users = self._find_similar_users(db, user_id, user_ratings)
        
        recommendations = []
        
        # Obtener libros que el usuario no ha leído
        read_books_query = db.query(ReadingHistory.book_id).filter(
            ReadingHistory.user_id == user_id
        ).all()
        read_books = set(book_id for (book_id,) in read_books_query)
        
        # Obtener recomendaciones de usuarios similares
        book_scores = defaultdict(list)
        
        for similar_user_id, similarity in similar_users[:10]:  # Top 10 de usuarios similares
            similar_user_ratings = self._get_user_ratings(db, similar_user_id)
            
            for book_id, rating in similar_user_ratings.items():
                if book_id not in read_books and book_id not in user_ratings:
                    book_scores[book_id].append(rating * similarity)
        
        # Calcular puntuaciones promedio 
        for book_id, scores in book_scores.items():
            if len(scores) >= 1:  # Al menos 1 puntuacion para considerar
                avg_score = sum(scores) / len(scores)
                book = db.query(Book).filter(Book.id == book_id).first()
                if book:
                    recommendations.append(RecommendationResponse(
                        book=BookResponse.from_orm(book),
                        score=avg_score,
                        reason="Recomendado por usuarios con gustos similares"
                    ))
        
        recommendations.sort(key=lambda x: x.score, reverse=True)
        return recommendations[:limit]
    
    def get_popular_recommendations(self, db: Session, limit: int = 10) -> List[RecommendationResponse]:
        """Recomendaciones de libros populares"""
        # Obtener libros con alta calificación y número de reseñas
        popular_books = db.query(Book).filter(
            and_(
                Book.average_rating >= 3.0,
                Book.rating_count >= 1
            )
        ).order_by(
            desc(Book.average_rating),
            desc(Book.rating_count)
        ).limit(limit).all()
        
        recommendations = []
        for book in popular_books:
            score = (book.average_rating / 5.0) * math.log(book.rating_count + 1)
            recommendations.append(RecommendationResponse(
                book=BookResponse.from_orm(book),
                score=score,
                reason="Popular entre la comunidad"
            ))
        
        return recommendations
    
    def _get_user_ratings(self, db: Session, user_id: int) -> Dict[int, float]:
        """Get user's book ratings"""
        ratings = db.query(Review.book_id, Review.rating).filter(
            Review.user_id == user_id
        ).all()
        return {book_id: rating for book_id, rating in ratings}
    
    def _find_similar_users(self, db: Session, user_id: int, user_ratings: Dict[int, float]) -> List[Tuple[int, float]]:
        """Find users with similar tastes using Pearson correlation"""
        # Obtener usuarios que han calificado libros
        other_users = db.query(Review.user_id).filter(
            Review.user_id != user_id
        ).distinct().all()
        
        similarities = []
        
        for other_user_tuple in other_users:
            other_user_id = other_user_tuple[0]  
            other_ratings = self._get_user_ratings(db, other_user_id)
            
            # Find common books
            common_books = set(user_ratings.keys()) & set(other_ratings.keys())
            
            if len(common_books) >= 3:  # Al menos 3 libros en común
                correlation = self._pearson_correlation(
                    [user_ratings[book_id] for book_id in common_books],
                    [other_ratings[book_id] for book_id in common_books]
                )
                
                if correlation > 0.3:  # Solo considerar correlaciones positivas
                    similarities.append((other_user_id, correlation))
        
        similarities.sort(key=lambda x: x[1], reverse=True)
        return similarities
    
    def _pearson_correlation(self, x: List[float], y: List[float]) -> float:
        """Calculate Pearson correlation coefficient"""
        n = len(x)
        if n == 0:
            return 0
        
        sum_x = sum(x)
        sum_y = sum(y)
        sum_x_sq = sum(xi * xi for xi in x)
        sum_y_sq = sum(yi * yi for yi in y)
        sum_xy = sum(xi * yi for xi, yi in zip(x, y))
        
        numerator = sum_xy - (sum_x * sum_y / n)
        denominator = math.sqrt((sum_x_sq - sum_x * sum_x / n) * (sum_y_sq - sum_y * sum_y / n))
        
        if denominator == 0:
            return 0
        
        return numerator / denominator
    
    def _infer_preferences_from_history(self, db: Session, user_id: int):
        """Infer user preferences from reading history and ratings"""
        # Obtener ratings del usuario agrupados por género
        genre_ratings = db.query(
            Book.genre,
            func.avg(Review.rating).label('avg_rating'),
            func.count(Review.id).label('count')
        ).join(Review).filter(
            Review.user_id == user_id
        ).group_by(Book.genre).all()
        
        for genre, avg_rating, count in genre_ratings:
            # Convertir rating a una puntuación de preferencia
            preference_score = (float(avg_rating) - 3) / 2
            
            weight = min(float(count) / 5.0, 1.0)  
            final_score = preference_score * weight
            
            # Crear o actualizar la preferencia 
            existing_pref = db.query(UserPreference).filter(
                and_(UserPreference.user_id == user_id, UserPreference.genre == genre)
            ).first()
            
            if existing_pref:
                existing_pref.preference_score = final_score
            else:
                new_pref = UserPreference(
                    user_id=user_id,
                    genre=genre,
                    preference_score=final_score
                )
                db.add(new_pref)
        
        db.commit()
