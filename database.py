from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base
import psycopg2

DATABASE_URL = "postgresql://postgres:espectro63@localhost:5432/bookrecommendations"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    """Initialize database tables"""
    Base.metadata.create_all(bind=engine)

def get_db():
    """Dependency to get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
