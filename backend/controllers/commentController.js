const pool = require('../config/db');
const { isNonEmptyString } = require('../utils/validation');

async function createComment(req, res) {
  try {
    const { news_id, content } = req.body;
    const userId = req.user.id;

    if (!news_id || isNaN(news_id)) {
      return res.status(400).json({ message: 'ID de noticia inválido.' });
    }
    if (!isNonEmptyString(content)) {
      return res.status(400).json({ message: 'Contenido del comentario requerido.' });
    }

    const result = await pool.query(
      `INSERT INTO comments (news_id, user_id, content) VALUES ($1, $2, $3) RETURNING *`,
      [news_id, userId, content]
    );

    const commentWithUser = await pool.query(
      `SELECT c.*, u.username FROM comments c JOIN users u ON c.user_id = u.id WHERE c.id = $1`,
      [result.rows[0].id]
    );

    res.status(201).json({ message: 'Comentario agregado.', comment: commentWithUser.rows[0] });
  } catch (error) {
    console.error('Error en createComment:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
}

async function getCommentsByNews(req, res) {
  try {
    const { news_id } = req.params;
    const result = await pool.query(
      `SELECT c.*, u.username FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.news_id = $1
       ORDER BY c.created_at ASC`,
      [news_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error en getCommentsByNews:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
}

module.exports = { createComment, getCommentsByNews };
