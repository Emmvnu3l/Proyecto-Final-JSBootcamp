const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'blog_noticias',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432,
});

async function runInitSql() {
  try {
    const sqlPath = path.join(__dirname, 'models', 'init.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    await pool.query(sql);
    console.log('Tablas creadas e índices aplicados correctamente.');
    console.log('Categorías de ejemplo insertadas.');
  } catch (err) {
    console.error('Error al ejecutar init.sql:', err.message);
  } finally {
    await pool.end();
  }
}

runInitSql();
