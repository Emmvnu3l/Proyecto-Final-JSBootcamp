const pool = require('../config/db');

async function toggleLike(req, res) {
  try {
    const { news_id, type } = req.body;
    const userId = req.user.id;

    if (!news_id || isNaN(news_id)) {
      return res.status(400).json({ message: 'ID de noticia inválido.' });
    }
    if (!['like', 'dislike'].includes(type)) {
      return res.status(400).json({ message: "Tipo debe ser 'like' o 'dislike'." });
    }

    const existing = await pool.query(
      'SELECT * FROM likes WHERE news_id = $1 AND user_id = $2',
      [news_id, userId]
    );

    if (existing.rows.length > 0) {
      const current = existing.rows[0];
      if (current.type === type) {
        await pool.query('DELETE FROM likes WHERE id = $1', [current.id]);
        return res.json({ message: `${type === 'like' ? 'Like' : 'Dislike'} removido.` });
      } else {
        const result = await pool.query(
          'UPDATE likes SET type = $1 WHERE id = $2 RETURNING *',
          [type, current.id]
        );
        return res.json({ message: 'Preferencia actualizada.', like: result.rows[0] });
      }
    }

    const result = await pool.query(
      'INSERT INTO likes (news_id, user_id, type) VALUES ($1, $2, $3) RETURNING *',
      [news_id, userId, type]
    );

    res.status(201).json({ message: `${type === 'like' ? 'Like' : 'Dislike'} registrado.`, like: result.rows[0] });
  } catch (error) {
    console.error('Error en toggleLike:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
}

async function getLikesByNews(req, res) {
  try {
    const { news_id } = req.params;
    const result = await pool.query(
      `SELECT l.type, u.id AS user_id, u.username
       FROM likes l
       JOIN users u ON l.user_id = u.id
       WHERE l.news_id = $1`,
      [news_id]
    );

    const likes = result.rows.filter(r => r.type === 'like');
    const dislikes = result.rows.filter(r => r.type === 'dislike');

    res.json({
      likes_count: likes.length,
      dislikes_count: dislikes.length,
      likes_users: likes.map(l => ({ id: l.user_id, username: l.username })),
      dislikes_users: dislikes.map(l => ({ id: l.user_id, username: l.username })),
    });
  } catch (error) {
    console.error('Error en getLikesByNews:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
}

module.exports = { toggleLike, getLikesByNews };
