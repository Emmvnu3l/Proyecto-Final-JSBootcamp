const { Pool } = require('pg');
require('dotenv').config();

const config = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432,
};

async function createDatabase() {
  const pool = new Pool({ ...config, database: 'postgres' });
  try {
    const dbName = process.env.DB_NAME || 'blog_noticias';
    await pool.query(`CREATE DATABASE "${dbName}"`);
    console.log(`Base de datos "${dbName}" creada correctamente.`);
  } catch (err) {
    if (err.code === '42P04') {
      console.log('La base de datos ya existe.');
    } else {
      console.error('Error al crear la base de datos:', err.message);
    }
  } finally {
    await pool.end();
  }
}

createDatabase();
