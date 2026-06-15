const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { isValidEmail, isNonEmptyString } = require('../utils/validation');

const JWT_SECRET = process.env.JWT_SECRET || 'secreto_por_defecto';

async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!isNonEmptyString(username, 40)) {
      return res.status(400).json({ message: 'Usuario inválido. Máximo 40 caracteres.' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Correo electrónico inválido.' });
    }
    if (!isNonEmptyString(password)) {
      return res.status(400).json({ message: 'Contraseña requerida.' });
    }

    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'El usuario o correo ya existe.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
      [username, email, passwordHash]
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({ message: 'Usuario registrado.', user, token });
  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!isValidEmail(email) || !isNonEmptyString(password)) {
      return res.status(400).json({ message: 'Correo y contraseña requeridos.' });
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      message: 'Login exitoso.',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
}

module.exports = { register, login };
