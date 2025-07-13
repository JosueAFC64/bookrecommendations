from database import SessionLocal, init_db
from models import User, Book, Review, ReadingHistory, UserPreference
from auth import get_password_hash
from datetime import datetime, timedelta
import random


def seed_database():
    """Poblar la base de datos con datos de ejemplo"""
    init_db()
    db = SessionLocal()
    
    try:
        # Create admin user
        admin_user = User(
            email="admin@bookstore.com",
            full_name="Administrator",
            hashed_password=get_password_hash("admin123"),
            role="admin"
        )
        db.add(admin_user)
        
        # Create regular users
        users = [
            User(
                email="juan@example.com",
                full_name="Juan Pérez",
                hashed_password=get_password_hash("password123")
            ),
            User(
                email="maria@example.com",
                full_name="María García",
                hashed_password=get_password_hash("password123")
            ),
            User(
                email="carlos@example.com",
                full_name="Carlos López",
                hashed_password=get_password_hash("password123")
            )
        ]
        
        for user in users:
            db.add(user)
        
        db.commit()
        
        # Create books
        books = [
            Book(
                title="Cien años de soledad",
                author="Gabriel García Márquez",
                genre="Realismo Mágico",
                description="Una obra maestra de la literatura latinoamericana",
                publication_year=1967,
                pages=417,
                isbn="978-0307474728",
                average_rating=4.5,
                rating_count=1250
            ),
            Book(
                title="1984",
                author="George Orwell",
                genre="Distopía",
                description="Una novela distópica sobre el totalitarismo",
                publication_year=1949,
                pages=328,
                isbn="978-0451524935",
                average_rating=4.3,
                rating_count=2100
            ),
            Book(
                title="El Quijote",
                author="Miguel de Cervantes",
                genre="Clásico",
                description="La obra cumbre de la literatura española",
                publication_year=1605,
                pages=863,
                isbn="978-8420412146",
                average_rating=4.1,
                rating_count=890
            ),
            Book(
                title="Rayuela",
                author="Julio Cortázar",
                genre="Literatura Experimental",
                description="Una novela innovadora y experimental",
                publication_year=1963,
                pages=635,
                isbn="978-8437604572",
                average_rating=4.2,
                rating_count=756
            ),
            Book(
                title="La casa de los espíritus",
                author="Isabel Allende",
                genre="Realismo Mágico",
                description="Una saga familiar llena de magia y política",
                publication_year=1982,
                pages=433,
                isbn="978-8401242267",
                average_rating=4.4,
                rating_count=1100
            ),
            Book(
                title="Fahrenheit 451",
                author="Ray Bradbury",
                genre="Ciencia Ficción",
                description="Una distopía sobre la censura de libros",
                publication_year=1953,
                pages=249,
                isbn="978-1451673319",
                average_rating=4.0,
                rating_count=1800
            ),
            Book(
                title="El amor en los tiempos del cólera",
                author="Gabriel García Márquez",
                genre="Realismo Mágico",
                description="Una historia de amor que trasciende el tiempo",
                publication_year=1985,
                pages=348,
                isbn="978-0307389732",
                average_rating=4.3,
                rating_count=950
            ),
            Book(
                title="Dune",
                author="Frank Herbert",
                genre="Ciencia Ficción",
                description="Una épica de ciencia ficción en el desierto",
                publication_year=1965,
                pages=688,
                isbn="978-0441172719",
                average_rating=4.6,
                rating_count=2500
            )
        ]
        
        for book in books:
            db.add(book)
        
        db.commit()
        
        # Create reviews
        user_ids = [user.id for user in db.query(User).filter(User.role == "user").all()]
        book_ids = [book.id for book in db.query(Book).all()]
        
        reviews = []
        for _ in range(50):  # Create 50 random reviews
            review = Review(
                user_id=random.choice(user_ids),
                book_id=random.choice(book_ids),
                rating=random.uniform(3.0, 5.0),
                comment=f"Comentario de ejemplo {random.randint(1, 100)}"
            )
            reviews.append(review)
        
        for review in reviews:
            db.add(review)
        
        # Create reading history
        reading_statuses = ["QUIERO_LEER", "LEYENDO", "LEIDO", "ABANDONADO"]
        
        for user_id in user_ids:
            for _ in range(random.randint(3, 8)):  # 3-8 books per user
                history = ReadingHistory(
                    user_id=user_id,
                    book_id=random.choice(book_ids),
                    status=random.choice(reading_statuses),
                    progress_pages=random.randint(0, 500),
                    start_date=datetime.now() - timedelta(days=random.randint(1, 365)),
                    finish_date=datetime.now() - timedelta(days=random.randint(1, 30))
                    if random.choice([True, False]) else None
                )
                db.add(history)
        
        # Create user preferences
        genres = ["Realismo Mágico", "Distopía", "Clásico", "Literatura Experimental", "Ciencia Ficción"]
        
        for user_id in user_ids:
            for genre in random.sample(genres, random.randint(2, 4)):
                preference = UserPreference(
                    user_id=user_id,
                    genre=genre,
                    preference_score=random.uniform(-0.5, 1.0)
                )
                db.add(preference)
        
        db.commit()
        print("✅ Base de datos poblada exitosamente!")
        
    except Exception as e:
        print(f"❌ Error al poblar la base de datos: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
