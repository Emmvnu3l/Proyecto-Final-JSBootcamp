const pool = require('../config/db');
const { isNonEmptyString } = require('../utils/validation');

async function createNews(req, res) {
  try {
    const { title, content, author, category_id } = req.body;
    const userId = req.user.id;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!isNonEmptyString(title, 60)) {
      return res.status(400).json({ message: 'Título inválido. Máximo 60 caracteres.' });
    }
    if (!isNonEmptyString(content, 4000)) {
      return res.status(400).json({ message: 'Contenido inválido. Máximo 4000 caracteres.' });
    }
    if (!isNonEmptyString(author, 40)) {
      return res.status(400).json({ message: 'Autor inválido. Máximo 40 caracteres.' });
    }

    const result = await pool.query(
      `INSERT INTO news (title, image_url, content, author, category_id, user_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title, imageUrl, content, author, category_id || null, userId]
    );

    res.status(201).json({ message: 'Noticia creada.', news: result.rows[0] });
  } catch (error) {
    console.error('Error en createNews:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
}

async function getAllNews(req, res) {
  try {
    const { category, order } = req.query;
    let sql = `
      SELECT n.*, c.name AS category_name, u.username AS author_username
      FROM news n
      LEFT JOIN categories c ON n.category_id = c.id
      LEFT JOIN users u ON n.user_id = u.id
    `;
    const params = [];
    const conditions = [];

    if (category) {
      params.push(category);
      conditions.push(`n.category_id = $${params.length}`);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    const sortOrder = order === 'asc' ? 'ASC' : 'DESC';
    sql += ` ORDER BY n.created_at ${sortOrder}`;

    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error en getAllNews:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
}

async function getNewsById(req, res) {
  try {
    const { id } = req.params;
    const newsResult = await pool.query(
      `SELECT n.*, c.name AS category_name, u.username AS author_username
       FROM news n
       LEFT JOIN categories c ON n.category_id = c.id
       LEFT JOIN users u ON n.user_id = u.id
       WHERE n.id = $1`,
      [id]
    );

    if (newsResult.rows.length === 0) {
      return res.status(404).json({ message: 'Noticia no encontrada.' });
    }

    const commentsResult = await pool.query(
      `SELECT c.*, u.username
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.news_id = $1
       ORDER BY c.created_at ASC`,
      [id]
    );

    const likesResult = await pool.query(
      `SELECT l.type, u.id AS user_id, u.username
       FROM likes l
       JOIN users u ON l.user_id = u.id
       WHERE l.news_id = $1`,
      [id]
    );

    const likes = likesResult.rows.filter(l => l.type === 'like');
    const dislikes = likesResult.rows.filter(l => l.type === 'dislike');

    res.json({
      ...newsResult.rows[0],
      comments: commentsResult.rows,
      likes_count: likes.length,
      dislikes_count: dislikes.length,
      likes_users: likes.map(l => ({ id: l.user_id, username: l.username })),
      dislikes_users: dislikes.map(l => ({ id: l.user_id, username: l.username })),
    });
  } catch (error) {
    console.error('Error en getNewsById:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
}

async function updateNews(req, res) {
  try {
    const { id } = req.params;
    const { title, content, author, category_id } = req.body;
    const userId = req.user.id;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const existing = await pool.query('SELECT * FROM news WHERE id = $1 AND user_id = $2', [id, userId]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Noticia no encontrada o no autorizada.' });
    }

    const fields = [];
    const values = [];
    let idx = 1;

    if (isNonEmptyString(title, 60)) { fields.push(`title = $${idx++}`); values.push(title); }
    if (isNonEmptyString(content, 4000)) { fields.push(`content = $${idx++}`); values.push(content); }
    if (isNonEmptyString(author, 40)) { fields.push(`author = $${idx++}`); values.push(author); }
    if (category_id !== undefined) { fields.push(`category_id = $${idx++}`); values.push(category_id || null); }
    if (imageUrl) { fields.push(`image_url = $${idx++}`); values.push(imageUrl); }
    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const sql = `UPDATE news SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
    const result = await pool.query(sql, values);
    res.json({ message: 'Noticia actualizada.', news: result.rows[0] });
  } catch (error) {
    console.error('Error en updateNews:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
}

async function deleteNews(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query('DELETE FROM news WHERE id = $1 AND user_id = $2 RETURNING id', [id, userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Noticia no encontrada o no autorizada.' });
    }

    res.json({ message: 'Noticia eliminada.' });
  } catch (error) {
    console.error('Error en deleteNews:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
}

module.exports = { createNews, getAllNews, getNewsById, updateNews, deleteNews };
