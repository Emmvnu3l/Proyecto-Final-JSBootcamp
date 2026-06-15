const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { toggleLike, getLikesByNews } = require('../controllers/likeController');

router.get('/news/:news_id', getLikesByNews);
router.post('/', authenticateToken, toggleLike);

module.exports = router;
