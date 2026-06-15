const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { createComment, getCommentsByNews } = require('../controllers/commentController');

router.get('/news/:news_id', getCommentsByNews);
router.post('/', authenticateToken, createComment);

module.exports = router;
