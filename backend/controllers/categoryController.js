const pool = require('../config/db');

async function getAllCategories(req, res) {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY name ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error en getAllCategories:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
}

module.exports = { getAllCategories };
