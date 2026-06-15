-- Base de datos: blog_noticias

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(40) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de categorías
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(60) NOT NULL UNIQUE
);

-- Tabla de noticias
CREATE TABLE IF NOT EXISTS news (
  id SERIAL PRIMARY KEY,
  title VARCHAR(60) NOT NULL,
  image_url VARCHAR(255),
  content TEXT NOT NULL CHECK (LENGTH(content) <= 4000),
  author VARCHAR(40) NOT NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de comentarios
CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  news_id INTEGER REFERENCES news(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de likes (tipo: 'like' o 'dislike')
CREATE TABLE IF NOT EXISTS likes (
  id SERIAL PRIMARY KEY,
  news_id INTEGER REFERENCES news(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(10) NOT NULL CHECK (type IN ('like', 'dislike')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(news_id, user_id)
);

-- Índices para optimizar JOINs y filtros
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category_id);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at);
CREATE INDEX IF NOT EXISTS idx_comments_news ON comments(news_id);
CREATE INDEX IF NOT EXISTS idx_likes_news ON likes(news_id);

-- Insertar categorías de ejemplo
INSERT INTO categories (name) VALUES
  ('Tecnología'),
  ('Deportes'),
  ('Política'),
  ('Entretenimiento'),
  ('Ciencia')
ON CONFLICT (name) DO NOTHING;
