const express = require('express');
const router = express.Router();
const pool = require('../db');
const { Producto, Categoria, Proveedor } = require('../orm');

// GET todos los productos con categoria y proveedor (ORM)
router.get('/', async (req, res) => {
  try {
    const productos = await Producto.findAll({
      include: [
        { model: Categoria, attributes: ['nombre'] },
        { model: Proveedor, attributes: ['nombre'] },
      ],
    });
    const result = productos.map(p => ({
      id_producto: p.id_producto,
      nombre:      p.nombre,
      precio:      p.precio,
      stock:       p.stock,
      id_categoria: p.id_categoria,
      id_proveedor: p.id_proveedor,
      categoria:   p.categorium?.nombre,
      proveedor:   p.proveedor?.nombre,
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET productos con stock menor al promedio (SQL explícito — subquery avanzada)
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

// GET categorias (ORM)
router.get('/categorias', async (req, res) => {
  try {
    const cats = await Categoria.findAll({ order: [['nombre', 'ASC']] });
    res.json(cats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET proveedores (ORM)
router.get('/proveedores', async (req, res) => {
  try {
    const provs = await Proveedor.findAll({ order: [['nombre', 'ASC']] });
    res.json(provs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST crear producto (ORM)
router.post('/', async (req, res) => {
  const { nombre, precio, stock, id_categoria, id_proveedor } = req.body;
  try {
    const producto = await Producto.create({ nombre, precio, stock, id_categoria, id_proveedor });
    res.status(201).json(producto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT actualizar producto (ORM)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, precio, stock, id_categoria, id_proveedor } = req.body;
  try {
    const [updated] = await Producto.update(
      { nombre, precio, stock, id_categoria, id_proveedor },
      { where: { id_producto: id } }
    );
    if (!updated) return res.status(404).json({ error: 'Producto no encontrado' });
    const producto = await Producto.findByPk(id);
    res.json(producto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE eliminar producto (ORM)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Producto.destroy({ where: { id_producto: id } });
    if (!deleted) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ mensaje: 'Producto eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
