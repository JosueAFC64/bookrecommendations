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
        # Get user preferences
        preferences = db.query(UserPreference).filter(
            UserPreference.user_id == user_id
        ).all()
        
        if not preferences:
            # If no explicit preferences, infer from reading history
            self._infer_preferences_from_history(db, user_id)
            preferences = db.query(UserPreference).filter(
                UserPreference.user_id == user_id
            ).all()
        
        recommendations = []
        
        # Get books user hasn't read
        read_books_query = db.query(ReadingHistory.book_id).filter(
            ReadingHistory.user_id == user_id
        ).all()
        read_books_ids = [book_id for (book_id,) in read_books_query]
        
        for pref in preferences:
            if pref.preference_score > 0:  # Only positive preferences
                books = db.query(Book).filter(
                    and_(
                        Book.genre == pref.genre,
                        ~Book.id.in_(read_books_ids),
                        Book.average_rating >= 3.5  # Only well-rated books
                    )
                ).order_by(desc(Book.average_rating)).limit(5).all()
                
                for book in books:
                    score = pref.preference_score * (book.average_rating / 5.0)
                    recommendations.append(RecommendationResponse(
                        book=BookResponse.from_orm(book),
                        score=score,
                        reason=f"Recomendado por tu interés en {pref.genre}"
                    ))
        
        # Sort by score and return top recommendations
        recommendations.sort(key=lambda x: x.score, reverse=True)
        return recommendations[:limit]
    
    def get_author_recommendations(self, db: Session, user_id: int, limit: int = 10) -> List[RecommendationResponse]:
        """Recomendaciones basadas en autores favoritos"""
        # Find favorite authors based on high ratings
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
        
        # Get books user hasn't read
        read_books_query = db.query(ReadingHistory.book_id).filter(
            ReadingHistory.user_id == user_id
        ).all()
        read_books_ids = [book_id for (book_id,) in read_books_query]
        
        for author_data in favorite_authors:
            author, avg_rating, review_count = author_data
            
            # Get other books by this author
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
        # Get user's ratings
        user_ratings = self._get_user_ratings(db, user_id)
        if not user_ratings:
            return []
        
        # Find similar users
        similar_users = self._find_similar_users(db, user_id, user_ratings)
        
        recommendations = []
        
        # Get books user hasn't read
        read_books_query = db.query(ReadingHistory.book_id).filter(
            ReadingHistory.user_id == user_id
        ).all()
        read_books = set(book_id for (book_id,) in read_books_query)
        
        # Get recommendations from similar users
        book_scores = defaultdict(list)
        
        for similar_user_id, similarity in similar_users[:10]:  # Top 10 similar users
            similar_user_ratings = self._get_user_ratings(db, similar_user_id)
            
            for book_id, rating in similar_user_ratings.items():
                if book_id not in read_books and book_id not in user_ratings:
                    book_scores[book_id].append(rating * similarity)
        
        # Calculate average scores
        for book_id, scores in book_scores.items():
            if len(scores) >= 2:  # At least 2 similar users rated it
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
        # Get books with high ratings and many reviews
        popular_books = db.query(Book).filter(
            and_(
                Book.average_rating >= 4.0,
                Book.rating_count >= 5
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
        # Get all other users who have rated books
        other_users = db.query(Review.user_id).filter(
            Review.user_id != user_id
        ).distinct().all()
        
        similarities = []
        
        for other_user_tuple in other_users:
            other_user_id = other_user_tuple[0]  # Extract user_id from tuple
            other_ratings = self._get_user_ratings(db, other_user_id)
            
            # Find common books
            common_books = set(user_ratings.keys()) & set(other_ratings.keys())
            
            if len(common_books) >= 3:  # Need at least 3 common books
                correlation = self._pearson_correlation(
                    [user_ratings[book_id] for book_id in common_books],
                    [other_ratings[book_id] for book_id in common_books]
                )
                
                if correlation > 0.3:  # Only positive correlations
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
        # Get user's ratings grouped by genre
        genre_ratings = db.query(
            Book.genre,
            func.avg(Review.rating).label('avg_rating'),
            func.count(Review.id).label('count')
        ).join(Review).filter(
            Review.user_id == user_id
        ).group_by(Book.genre).all()
        
        for genre, avg_rating, count in genre_ratings:
            # Convert rating to preference score (-1 to 1)
            preference_score = (float(avg_rating) - 3) / 2
            
            # Weight by number of books read in genre
            weight = min(float(count) / 5.0, 1.0)  # Max weight at 5 books
            final_score = preference_score * weight
            
            # Create or update preference
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
