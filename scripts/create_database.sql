-- Crear la base de datos (ejecutar como superusuario)
--CREATE DATABASE bookrecommendations;

-- Conectarse a la base de datos bookrecommendations y ejecutar lo siguiente:

-- Tabla de usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de libros
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    description TEXT,
    publication_year INTEGER,
    pages INTEGER,
    isbn VARCHAR(20) UNIQUE,
    cover_url VARCHAR(500),
    average_rating DECIMAL(3,2) DEFAULT 0.0,
    rating_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de reseñas
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    rating DECIMAL(2,1) NOT NULL CHECK (rating >= 1.0 AND rating <= 5.0),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, book_id) -- Un usuario solo puede reseñar un libro una vez
);

-- Tabla de historial de lectura
CREATE TABLE reading_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('QUIERO_LEER', 'LEYENDO', 'LEIDO', 'ABANDONADO')),
    progress_pages INTEGER DEFAULT 0,
    start_date TIMESTAMP,
    finish_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de preferencias de usuario
CREATE TABLE user_preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    genre VARCHAR(100) NOT NULL,
    preference_score DECIMAL(3,2) DEFAULT 0.0 CHECK (preference_score >= -1.0 AND preference_score <= 1.0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, genre) -- Un usuario solo puede tener una preferencia por género
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_books_author ON books(author);
CREATE INDEX idx_books_genre ON books(genre);
CREATE INDEX idx_books_rating ON books(average_rating DESC);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_book_id ON reviews(book_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reading_history_user_id ON reading_history(user_id);
CREATE INDEX idx_reading_history_book_id ON reading_history(book_id);
CREATE INDEX idx_reading_history_status ON reading_history(status);
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX idx_user_preferences_genre ON user_preferences(genre);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at en reading_history
CREATE TRIGGER update_reading_history_updated_at 
    BEFORE UPDATE ON reading_history 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger para actualizar updated_at en user_preferences
CREATE TRIGGER update_user_preferences_updated_at 
    BEFORE UPDATE ON user_preferences 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Datos de ejemplo (opcional)
-- Usuario administrador
INSERT INTO users (email, full_name, hashed_password, role) VALUES 
('admin@bookstore.com', 'Administrator', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'ADMIN');

-- Usuarios de ejemplo
INSERT INTO users (email, full_name, hashed_password) VALUES 
('juan@example.com', 'Juan Pérez', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW'),
('maria@example.com', 'María García', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW'),
('carlos@example.com', 'Carlos López', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW');

-- Libros de ejemplo
INSERT INTO books (title, author, genre, description, publication_year, pages, isbn, average_rating, rating_count) VALUES 
('Cien años de soledad', 'Gabriel García Márquez', 'Realismo Mágico', 'Una obra maestra de la literatura latinoamericana', 1967, 417, '978-0307474728', 4.5, 1250),
('1984', 'George Orwell', 'Distopía', 'Una novela distópica sobre el totalitarismo', 1949, 328, '978-0451524935', 4.3, 2100),
('El Quijote', 'Miguel de Cervantes', 'Clásico', 'La obra cumbre de la literatura española', 1605, 863, '978-8420412146', 4.1, 890),
('Rayuela', 'Julio Cortázar', 'Literatura Experimental', 'Una novela innovadora y experimental', 1963, 635, '978-8437604572', 4.2, 756),
('La casa de los espíritus', 'Isabel Allende', 'Realismo Mágico', 'Una saga familiar llena de magia y política', 1982, 433, '978-8401242267', 4.4, 1100),
('Fahrenheit 451', 'Ray Bradbury', 'Ciencia Ficción', 'Una distopía sobre la censura de libros', 1953, 249, '978-1451673319', 4.0, 1800),
('El amor en los tiempos del cólera', 'Gabriel García Márquez', 'Realismo Mágico', 'Una historia de amor que trasciende el tiempo', 1985, 348, '978-0307389732', 4.3, 950),
('Dune', 'Frank Herbert', 'Ciencia Ficción', 'Una épica de ciencia ficción en el desierto', 1965, 688, '978-0441172719', 4.6, 2500);
