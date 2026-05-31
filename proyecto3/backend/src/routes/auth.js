const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcryptjs');
const { Usuario } = require('../orm');

// POST /api/auth/login (ORM)
router.post('/login', async (req, res) => {
  const { usuario, password } = req.body;
  if (!usuario || !password)
    return res.status(400).json({ error: 'Usuario y contraseña requeridos' });

  try {
    const user = await Usuario.findOne({ where: { usuario } });
    if (!user)
      return res.status(401).json({ error: 'Credenciales incorrectas' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match)
      return res.status(401).json({ error: 'Credenciales incorrectas' });

    req.session.usuario = {
      id:      user.id_usuario,
      usuario: user.usuario,
      nombre:  user.nombre,
      rol:     user.rol,
    };
    res.json({ mensaje: 'Login exitoso', usuario: req.session.usuario });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ mensaje: 'Sesión cerrada' }));
});

// GET /api/auth/me — verifica sesión activa
router.get('/me', (req, res) => {
  if (req.session.usuario) return res.json({ usuario: req.session.usuario });
  res.status(401).json({ error: 'No autenticado' });
});

module.exports = router;
