const express  = require('express');
const router   = express.Router();
const bcrypt   = require('bcryptjs');
const pool     = require('../db');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { usuario, password } = req.body;
  if (!usuario || !password)
    return res.status(400).json({ error: 'Usuario y contraseña requeridos' });

  try {
    const result = await pool.query(
      'SELECT * FROM usuario WHERE usuario = $1', [usuario]
    );
    if (result.rows.length === 0)
      return res.status(401).json({ error: 'Credenciales incorrectas' });

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match)
      return res.status(401).json({ error: 'Credenciales incorrectas' });

    req.session.usuario = { id: user.id_usuario, usuario: user.usuario, nombre: user.nombre };
    res.json({ mensaje: 'Login exitoso', usuario: req.session.usuario });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ mensaje: 'Sesión cerrada' }));
});

// GET /api/auth/me  — verifica sesión activa
router.get('/me', (req, res) => {
  if (req.session.usuario) return res.json({ usuario: req.session.usuario });
  res.status(401).json({ error: 'No autenticado' });
});

module.exports = router;