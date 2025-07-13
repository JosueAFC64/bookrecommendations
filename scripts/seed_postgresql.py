import psycopg2
from psycopg2.extras import RealDictCursor
import bcrypt
from datetime import datetime, timedelta
import random


def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')


def seed_postgresql_database():
    """Poblar la base de datos PostgreSQL con datos adicionales"""
    
    # Configuración de conexión
    conn_params = {
        'host': 'localhost',
        'database': 'bookrecommendations',
        'user': 'postgres',
        'password': 'espectro63',
        'port': 5432
    }
    
    try:
        # Conectar a la base de datos
        conn = psycopg2.connect(**conn_params)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        print("🔗 Conectado a PostgreSQL")
        
        # Verificar si ya hay datos
        cur.execute("SELECT COUNT(*) FROM users")
        user_count = cur.fetchone()[0]
        
        if user_count > 0:
            print(f"✅ La base de datos ya tiene {user_count} usuarios")
            return
        
        # Insertar usuarios adicionales
        users_data = [
            ('admin@bookstore.com', 'Administrator', hash_password('admin123'), 'admin'),
            ('juan@example.com', 'Juan Pérez', hash_password('password123'), 'user'),
            ('maria@example.com', 'María García', hash_password('password123'), 'user'),
            ('carlos@example.com', 'Carlos López', hash_password('password123'), 'user'),
            ('ana@example.com', 'Ana Rodríguez', hash_password('password123'), 'user'),
            ('luis@example.com', 'Luis Martínez', hash_password('password123'), 'user')
        ]
        
        cur.executemany(
            "INSERT INTO users (email, full_name, hashed_password, role) VALUES (%s, %s, %s, %s)",
            users_data
        )
        
        print("✅ Usuarios insertados")
        
        # Obtener IDs de usuarios
        cur.execute("SELECT id FROM users WHERE role = 'user'")
        user_ids = [row[0] for row in cur.fetchall()]
        
        cur.execute("SELECT id FROM books")
        book_ids = [row[0] for row in cur.fetchall()]
        
        # Insertar reseñas aleatorias
        reviews_data = []
        for _ in range(100):  # 100 reseñas aleatorias
            user_id = random.choice(user_ids)
            book_id = random.choice(book_ids)
            rating = round(random.uniform(2.0, 5.0), 1)
            comment = f"Comentario de ejemplo {random.randint(1, 1000)}"
            
            reviews_data.append((user_id, book_id, rating, comment))
        
        # Insertar reseñas evitando duplicados
        for review in reviews_data:
            try:
                cur.execute(
                    "INSERT INTO reviews (user_id, book_id, rating, comment) VALUES (%s, %s, %s, %s)",
                    review
                )
            except psycopg2.IntegrityError:
                # Ignorar duplicados (mismo usuario y libro)
                conn.rollback()
                continue
            conn.commit()
        
        print("✅ Reseñas insertadas")
        
        # Insertar historial de lectura
        reading_statuses = ['QUIERO_LEER', 'LEYENDO', 'LEIDO', 'ABANDONADO']
        
        for user_id in user_ids:
            # Cada usuario tendrá entre 5 y 15 libros en su historial
            num_books = random.randint(5, 15)
            user_books = random.sample(book_ids, min(num_books, len(book_ids)))
            
            for book_id in user_books:
                status = random.choice(reading_statuses)
                progress = random.randint(0, 500)
                start_date = datetime.now() - timedelta(days=random.randint(1, 365))
                finish_date = None
                
                if status == 'LEIDO':
                    finish_date = start_date + timedelta(days=random.randint(1, 60))
                elif status == 'ABANDONADO':
                    finish_date = start_date + timedelta(days=random.randint(1, 30))
                
                cur.execute(
                    """INSERT INTO reading_history 
                       (user_id, book_id, status, progress_pages, start_date, finish_date) 
                       VALUES (%s, %s, %s, %s, %s, %s)""",
                    (user_id, book_id, status, progress, start_date, finish_date)
                )
        
        print("✅ Historial de lectura insertado")
        
        # Insertar preferencias de usuario
        genres = ['Realismo Mágico', 'Distopía', 'Clásico', 'Literatura Experimental', 'Ciencia Ficción', 'Romance',
                  'Misterio', 'Fantasía']
        
        for user_id in user_ids:
            # Cada usuario tendrá preferencias para 3-6 géneros
            user_genres = random.sample(genres, random.randint(3, 6))
            
            for genre in user_genres:
                preference_score = round(random.uniform(-0.5, 1.0), 2)
                
                cur.execute(
                    """INSERT INTO user_preferences (user_id, genre, preference_score) 
                       VALUES (%s, %s, %s)""",
                    (user_id, genre, preference_score)
                )
        
        print("✅ Preferencias de usuario insertadas")
        
        # Actualizar ratings promedio de libros
        cur.execute("""
            UPDATE books 
            SET average_rating = subquery.avg_rating,
                rating_count = subquery.count
            FROM (
                SELECT book_id, 
                       ROUND(AVG(rating), 2) as avg_rating,
                       COUNT(*) as count
                FROM reviews 
                GROUP BY book_id
            ) AS subquery
            WHERE books.id = subquery.book_id
        """)
        
        print("✅ Ratings promedio actualizados")
        
        conn.commit()
        print("🎉 Base de datos PostgreSQL poblada exitosamente!")
        
        # Mostrar estadísticas
        cur.execute("SELECT COUNT(*) FROM users")
        users_count = cur.fetchone()[0]
        
        cur.execute("SELECT COUNT(*) FROM books")
        books_count = cur.fetchone()[0]
        
        cur.execute("SELECT COUNT(*) FROM reviews")
        reviews_count = cur.fetchone()[0]
        
        cur.execute("SELECT COUNT(*) FROM reading_history")
        history_count = cur.fetchone()[0]
        
        print(f"""
📊 Estadísticas de la base de datos:
   👥 Usuarios: {users_count}
   📚 Libros: {books_count}
   ⭐ Reseñas: {reviews_count}
   📖 Historial de lectura: {history_count}
        """)
        
    except psycopg2.Error as e:
        print(f"❌ Error de PostgreSQL: {e}")
    except Exception as e:
        print(f"❌ Error general: {e}")
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()
        print("🔌 Conexión cerrada")


if __name__ == "__main__":
    seed_postgresql_database()
