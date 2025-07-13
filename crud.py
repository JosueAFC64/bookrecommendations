from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, and_, func
from typing import List, Optional
from datetime import datetime

from models import User, Book, Review, ReadingHistory, UserPreference
from schemas import UserCreate, BookCreate, ReviewCreate, ReadingHistoryCreate, BookSearch

def create_user(db: Session, user: UserCreate, hashed_password: str) -> User:
    """Create a new user"""
    db_user = User(
        email=user.email,
        full_name=user.full_name,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Get user by email"""
    return db.query(User).filter(User.email == email).first()

def create_book(db: Session, book: BookCreate) -> Book:
    """Create a new book"""
    db_book = Book(**book.dict())
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book

def get_books(db: Session, skip: int = 0, limit: int = 100) -> List[Book]:
    """Get books with pagination"""
    return db.query(Book).offset(skip).limit(limit).all()

def get_book_by_id(db: Session, book_id: int) -> Optional[Book]:
    """Get book by ID"""
    return db.query(Book).filter(Book.id == book_id).first()

def search_books(db: Session, search: BookSearch) -> List[Book]:
    """Advanced book search"""
    query = db.query(Book)
    
    conditions = []
    if search.title:
        conditions.append(Book.title.ilike(f"%{search.title}%"))
    if search.author:
        conditions.append(Book.author.ilike(f"%{search.author}%"))
    if search.genre:
        conditions.append(Book.genre.ilike(f"%{search.genre}%"))
    
    if conditions:
        query = query.filter(or_(*conditions))
    
    return query.all()

def create_review(db: Session, review: ReviewCreate, book_id: int, user_id: int) -> Review:
    """Create a book review"""
    db_review = Review(
        user_id=user_id,
        book_id=book_id,
        rating=review.rating,
        comment=review.comment
    )
    db.add(db_review)
    db.commit()  # Primero hacemos commit para guardar la reseña
    db.refresh(db_review)
    
    # Update book average rating
    book = db.query(Book).filter(Book.id == book_id).first()
    if book:
        avg_rating = db.query(func.avg(Review.rating)).filter(Review.book_id == book_id).scalar()
        rating_count = db.query(func.count(Review.id)).filter(Review.book_id == book_id).scalar()
        
        book.average_rating = round(float(avg_rating), 2) if avg_rating else 0.0
        book.rating_count = rating_count or 0
        
        db.commit()  # Segundo commit para actualizar el libro
    
    return db_review

def get_reviews_by_book(db: Session, book_id: int) -> List[Review]:
    """Get reviews for a book with user information"""
    return db.query(Review).options(
        joinedload(Review.user)
    ).filter(Review.book_id == book_id).all()

def create_reading_history(db: Session, history: ReadingHistoryCreate, user_id: int) -> ReadingHistory:
    """Create reading history entry"""
    db_history = ReadingHistory(
        user_id=user_id,
        book_id=history.book_id,
        status=history.status,
        progress_pages=history.progress_pages,
        start_date=history.start_date,
        finish_date=history.finish_date
    )
    db.add(db_history)
    db.commit()
    db.refresh(db_history)
    
    # Update user preferences based on reading history
    update_user_preferences_from_history(db, user_id, history.book_id)
    
    return db_history

def get_user_reading_history(db: Session, user_id: int) -> List[ReadingHistory]:
    """Get user's reading history with book information"""
    return db.query(ReadingHistory).options(
        joinedload(ReadingHistory.book)
    ).filter(ReadingHistory.user_id == user_id).all()

def update_user_preferences(db: Session, user_id: int, preferences: dict):
    """Update user preferences"""
    for genre, score in preferences.items():
        existing_pref = db.query(UserPreference).filter(
            and_(UserPreference.user_id == user_id, UserPreference.genre == genre)
        ).first()
        
        if existing_pref:
            existing_pref.preference_score = score
            existing_pref.updated_at = datetime.utcnow()
        else:
            new_pref = UserPreference(
                user_id=user_id,
                genre=genre,
                preference_score=score
            )
            db.add(new_pref)
    
    db.commit()

def update_user_preferences_from_history(db: Session, user_id: int, book_id: int):
    """Update user preferences based on reading history"""
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        return
    
    # Get user's review for this book
    review = db.query(Review).filter(
        and_(Review.user_id == user_id, Review.book_id == book_id)
    ).first()
    
    if review:
        # Update preference based on rating (normalize to -1 to 1 scale)
        preference_score = (review.rating - 3) / 2  # 1-5 scale to -1 to 1
        
        existing_pref = db.query(UserPreference).filter(
            and_(UserPreference.user_id == user_id, UserPreference.genre == book.genre)
        ).first()
        
        if existing_pref:
            # Average with existing preference
            existing_pref.preference_score = (existing_pref.preference_score + preference_score) / 2
            existing_pref.updated_at = datetime.utcnow()
        else:
            new_pref = UserPreference(
                user_id=user_id,
                genre=book.genre,
                preference_score=preference_score
            )
            db.add(new_pref)
        
        db.commit()
