const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET todos los clientes
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM cliente ORDER BY id_cliente
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET clientes que tienen al menos una venta (Subquery con IN)
router.get('/con-ventas', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT nombre, correo
      FROM cliente
      WHERE id_cliente IN (SELECT id_cliente FROM venta)
      ORDER BY nombre
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST crear cliente
router.post('/', async (req, res) => {
  const { nombre, correo } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO cliente (nombre, correo)
       VALUES ($1, $2) RETURNING *`,
      [nombre, correo]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT actualizar cliente
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, correo } = req.body;
  try {
    const result = await pool.query(
      `UPDATE cliente SET nombre=$1, correo=$2
       WHERE id_cliente=$3 RETURNING *`,
      [nombre, correo, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE eliminar cliente
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM cliente WHERE id_cliente=$1 RETURNING *', [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json({ mensaje: 'Cliente eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;