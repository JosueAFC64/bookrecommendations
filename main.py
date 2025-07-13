from fastapi import FastAPI, Depends, HTTPException, status, Response, Cookie
from fastapi.security import HTTPBearer
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import List, Optional
import uvicorn

from database import get_db, init_db
from auth import (
    authenticate_user, create_access_token, get_current_user, 
    get_password_hash, verify_token_from_cookie, get_current_active_user
)
from models import User, Book, Review, ReadingHistory, UserPreference
from schemas import (
    UserCreate, UserLogin, UserResponse, BookCreate, BookResponse, 
    ReviewCreate, ReviewResponse, ReadingHistoryCreate, ReadingHistoryResponse,
    BookSearch, RecommendationResponse
)
from recommendations import RecommendationEngine
from crud import (
    create_user, get_user_by_email, create_book, get_books, 
    get_book_by_id, create_review, get_reviews_by_book,
    create_reading_history, get_user_reading_history,
    update_user_preferences, search_books
)

app = FastAPI(title="Book Recommendation API", version="1.0.0")

# Mount static files
app.mount("/images", StaticFiles(directory="images"), name="images")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # Adjust for your frontend
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Initialize database
init_db()

# Initialize recommendation engine
recommendation_engine = RecommendationEngine()

@app.post("/auth/register", response_model=UserResponse)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    """Registro de nuevos usuarios"""
    # Check if user already exists
    db_user = get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    db_user = create_user(db, user, hashed_password)
    
    return UserResponse(
        id=db_user.id,
        email=db_user.email,
        full_name=db_user.full_name,
        role=db_user.role,
        is_active=db_user.is_active
    )

@app.post("/auth/login")
async def login(user: UserLogin, response: Response, db: Session = Depends(get_db)):
    """Autenticación de usuarios con JWT en cookies"""
    db_user = authenticate_user(db, user.email, user.password)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token = create_access_token(data={"sub": db_user.email})
    
    # Set secure HTTP-only cookie
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,  # Set to False for development
        samesite="lax",
        max_age=86400000,  # 1 day
        path="/",
        domain=None
    )
    
    return {
        "message": "Login successful",
        "user": UserResponse(
            id=db_user.id,
            email=db_user.email,
            full_name=db_user.full_name,
            role=db_user.role,
            is_active=db_user.is_active
        )
    }

@app.post("/auth/logout")
async def logout(response: Response):
    """Cerrar sesión eliminando la cookie"""
    response.delete_cookie(key="access_token")
    return {"message": "Logout successful"}

@app.get("/auth/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_active_user)
):
    """Obtener información del usuario actual"""
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        role=current_user.role,
        is_active=current_user.is_active
    )

@app.post("/books", response_model=BookResponse)
async def create_new_book(
    book: BookCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Crear un nuevo libro (solo administradores)"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    db_book = create_book(db, book)
    return BookResponse.from_orm(db_book)

@app.get("/books", response_model=List[BookResponse])
async def get_all_books(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Obtener catálogo de libros"""
    books = get_books(db, skip=skip, limit=limit)
    return [BookResponse.from_orm(book) for book in books]

@app.get("/books/{book_id}", response_model=BookResponse)
async def get_book(book_id: int, db: Session = Depends(get_db)):
    """Obtener información detallada de un libro"""
    book = get_book_by_id(db, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return BookResponse.from_orm(book)

@app.post("/books/search", response_model=List[BookResponse])
async def search_books_endpoint(
    search: BookSearch,
    db: Session = Depends(get_db)
):
    """Búsqueda avanzada de libros"""
    books = search_books(db, search)
    return [BookResponse.from_orm(book) for book in books]

@app.post("/books/{book_id}/reviews", response_model=ReviewResponse)
async def create_book_review(
    book_id: int,
    review: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Crear reseña de un libro"""
    # Check if book exists
    book = get_book_by_id(db, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    db_review = create_review(db, review, book_id, current_user.id)
    return ReviewResponse(
        id=db_review.id,
        user_id=db_review.user_id,
        book_id=db_review.book_id,
        rating=db_review.rating,
        comment=db_review.comment,
        created_at=db_review.created_at,
        user_name=db_review.user.full_name
    )

@app.get("/books/{book_id}/reviews", response_model=List[ReviewResponse])
async def get_book_reviews(book_id: int, db: Session = Depends(get_db)):
    """Obtener reseñas de un libro"""
    reviews = get_reviews_by_book(db, book_id)
    review_responses = []

    for review in reviews:
        review_response = ReviewResponse(
            id=review.id,
            user_id=review.user_id,
            book_id=review.book_id,
            rating=review.rating,
            comment=review.comment,
            created_at=review.created_at,
            user_name=review.user.full_name
        )
        review_responses.append(review_response)
    return review_responses

@app.post("/reading-history", response_model=ReadingHistoryResponse)
async def add_reading_history(
    history: ReadingHistoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Agregar libro al historial de lectura"""
    db_history = create_reading_history(db, history, current_user.id)
    return ReadingHistoryResponse(
        id=db_history.id,
        user_id=db_history.user_id,
        book_id=db_history.book_id,
        status=db_history.status,
        progress_pages=db_history.progress_pages,
        start_date=db_history.start_date,
        finish_date=db_history.finish_date,
        created_at=db_history.created_at,
        updated_at=db_history.updated_at,
        book_name=db_history.book.title
    )

@app.get("/reading-history", response_model=List[ReadingHistoryResponse])
async def get_reading_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Obtener historial de lectura del usuario"""
    history = get_user_reading_history(db, current_user.id)
    reading_historys = []
    for h in history:
        reading_history = ReadingHistoryResponse(
            id=h.id,
            user_id=h.user_id,
            book_id=h.book_id,
            status=h.status,
            progress_pages=h.progress_pages,
            start_date=h.start_date,
            finish_date=h.finish_date,
            created_at=h.created_at,
            updated_at=h.updated_at,
            book_name=h.book.title
        )
        reading_historys.append(reading_history)
    return reading_historys

@app.get("/recommendations/by-genre", response_model=List[RecommendationResponse])
async def get_genre_recommendations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Recomendaciones basadas en géneros preferidos"""
    recommendations = recommendation_engine.get_genre_recommendations(db, current_user.id)
    return recommendations

@app.get("/recommendations/by-author", response_model=List[RecommendationResponse])
async def get_author_recommendations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Recomendaciones basadas en autores favoritos"""
    recommendations = recommendation_engine.get_author_recommendations(db, current_user.id)
    return recommendations

@app.get("/recommendations/collaborative", response_model=List[RecommendationResponse])
async def get_collaborative_recommendations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Recomendaciones colaborativas basadas en usuarios similares"""
    recommendations = recommendation_engine.get_collaborative_recommendations(db, current_user.id)
    return recommendations

@app.get("/recommendations/popular", response_model=List[RecommendationResponse])
async def get_popular_recommendations(
    db: Session = Depends(get_db)
):
    """Recomendaciones de libros populares"""
    recommendations = recommendation_engine.get_popular_recommendations(db)
    return recommendations

@app.get("/preferences")
async def get_preferences(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Obtener preferencias de usuario"""
    preferences = db.query(UserPreference).filter(
        UserPreference.user_id == current_user.id
    ).all()
    
    # Convertir a diccionario para la respuesta
    preferences_dict = {}
    for pref in preferences:
        preferences_dict[pref.genre] = pref.preference_score
        
    return preferences_dict

@app.put("/preferences")
async def update_preferences(
    preferences: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Actualizar preferencias de usuario"""
    update_user_preferences(db, current_user.id, preferences)
    return {"message": "Preferences updated successfully"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
