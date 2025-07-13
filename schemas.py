from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from models import UserRole, ReadingStatus

class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: UserRole
    is_active: bool
    
    class Config:
        from_attributes = True

class BookCreate(BaseModel):
    title: str
    author: str
    genre: str
    description: Optional[str] = None
    publication_year: Optional[int] = None
    pages: Optional[int] = None
    isbn: Optional[str] = None
    cover_url: Optional[str] = None

class BookResponse(BaseModel):
    id: int
    title: str
    author: str
    genre: str
    description: Optional[str]
    publication_year: Optional[int]
    pages: Optional[int]
    isbn: Optional[str]
    cover_url: Optional[str]
    average_rating: float
    rating_count: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class BookSearch(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    genre: Optional[str] = None

class ReviewCreate(BaseModel):
    rating: float
    comment: Optional[str] = None

class ReviewResponse(BaseModel):
    id: int
    user_id: int
    book_id: int
    rating: float
    comment: Optional[str]
    created_at: datetime
    user_name: str  # Nombre del usuario que escribió la reseña
    
    class Config:
        from_attributes = True

class ReadingHistoryCreate(BaseModel):
    book_id: int
    status: ReadingStatus
    progress_pages: Optional[int] = 0
    start_date: Optional[datetime] = None
    finish_date: Optional[datetime] = None

class ReadingHistoryResponse(BaseModel):
    id: int
    user_id: int
    book_id: int
    status: ReadingStatus
    progress_pages: int
    start_date: Optional[datetime]
    finish_date: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    book_name: str
    
    class Config:
        from_attributes = True

class RecommendationResponse(BaseModel):
    book: BookResponse
    score: float
    reason: str
