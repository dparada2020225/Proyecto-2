const express = require('express');
const router = express.Router();
const pool = require('../db');
const { Cliente } = require('../orm');

// GET todos los clientes (ORM)
router.get('/', async (req, res) => {
  try {
    const clientes = await Cliente.findAll({ order: [['id_cliente', 'ASC']] });
    res.json(clientes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET clientes que tienen al menos una venta (SQL explícito — subquery avanzada)
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

// POST crear cliente (ORM)
router.post('/', async (req, res) => {
  const { nombre, correo } = req.body;
  try {
    const cliente = await Cliente.create({ nombre, correo });
    res.status(201).json(cliente);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT actualizar cliente (ORM)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, correo } = req.body;
  try {
    const [updated] = await Cliente.update(
      { nombre, correo },
      { where: { id_cliente: id } }
    );
    if (!updated) return res.status(404).json({ error: 'Cliente no encontrado' });
    const cliente = await Cliente.findByPk(id);
    res.json(cliente);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE eliminar cliente (ORM)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Cliente.destroy({ where: { id_cliente: id } });
    if (!deleted) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json({ mensaje: 'Cliente eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
