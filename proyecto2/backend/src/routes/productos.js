const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET todos los productos con categoria y proveedor (JOIN)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id_producto, p.nombre, p.precio, p.stock,
             c.nombre AS categoria, pr.nombre AS proveedor
      FROM producto p
      JOIN categoria c ON p.id_categoria = c.id_categoria
      JOIN proveedor pr ON p.id_proveedor = pr.id_proveedor
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET productos con stock menor al promedio (Subquery)
router.get('/bajo-stock', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT nombre, stock
      FROM producto
      WHERE stock < (SELECT AVG(stock) FROM producto)
      ORDER BY stock ASC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST crear producto
router.post('/', async (req, res) => {
  const { nombre, precio, stock, id_categoria, id_proveedor } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO producto (nombre, precio, stock, id_categoria, id_proveedor)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nombre, precio, stock, id_categoria, id_proveedor]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT actualizar producto
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, precio, stock, id_categoria, id_proveedor } = req.body;
  try {
    const result = await pool.query(
      `UPDATE producto SET nombre=$1, precio=$2, stock=$3,
       id_categoria=$4, id_proveedor=$5
       WHERE id_producto=$6 RETURNING *`,
      [nombre, precio, stock, id_categoria, id_proveedor, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE eliminar producto
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM producto WHERE id_producto=$1 RETURNING *', [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ mensaje: 'Producto eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET categorias (para el formulario)
router.get('/categorias', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categoria ORDER BY nombre');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET proveedores (para el formulario)
router.get('/proveedores', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM proveedor ORDER BY nombre');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;