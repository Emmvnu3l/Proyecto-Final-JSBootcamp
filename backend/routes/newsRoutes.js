const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { authenticateToken } = require('../middleware/authMiddleware');
const { createNews, getAllNews, getNewsById, updateNews, deleteNews } = require('../controllers/newsController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowed.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif, webp).'));
  },
});

router.get('/', getAllNews);
router.get('/:id', getNewsById);
router.post('/', authenticateToken, upload.single('image'), createNews);
router.put('/:id', authenticateToken, upload.single('image'), updateNews);
router.delete('/:id', authenticateToken, deleteNews);

module.exports = router;
