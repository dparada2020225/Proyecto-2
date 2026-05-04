const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET todas las ventas con cliente y empleado (JOIN)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT v.id_venta, v.fecha,
             c.nombre AS cliente,
             e.nombre AS empleado
      FROM venta v
      JOIN cliente c ON v.id_cliente = c.id_cliente
      JOIN empleado e ON v.id_empleado = e.id_empleado
      ORDER BY v.id_venta DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET detalle de una venta con productos (JOIN)
router.get('/:id/detalle', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT v.id_venta, p.nombre AS producto,
             d.cantidad, d.precio_unitario,
             (d.cantidad * d.precio_unitario) AS subtotal
      FROM detalle_venta d
      JOIN producto p ON d.id_producto = p.id_producto
      JOIN venta v ON d.id_venta = v.id_venta
      WHERE v.id_venta = $1
    `, [id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET empleados (para el formulario)
router.get('/empleados', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM empleado ORDER BY nombre');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST crear venta con detalle (Transacción explícita)
router.post('/', async (req, res) => {
  const { id_cliente, id_empleado, detalle } = req.body;
  // detalle = [{ id_producto, cantidad, precio_unitario }, ...]

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Insertar venta
    const ventaResult = await client.query(
      `INSERT INTO venta (id_cliente, id_empleado)
       VALUES ($1, $2) RETURNING id_venta`,
      [id_cliente, id_empleado]
    );
    const id_venta = ventaResult.rows[0].id_venta;

    // Insertar cada detalle y descontar stock
    for (const item of detalle) {
      await client.query(
        `INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario)
         VALUES ($1, $2, $3, $4)`,
        [id_venta, item.id_producto, item.cantidad, item.precio_unitario]
      );

      // Descontar stock
      const stockResult = await client.query(
        `UPDATE producto SET stock = stock - $1
         WHERE id_producto = $2 AND stock >= $1
         RETURNING stock`,
        [item.cantidad, item.id_producto]
      );

      if (stockResult.rows.length === 0) {
        throw new Error(`Stock insuficiente para producto id ${item.id_producto}`);
      }
    }

    await client.query('COMMIT');
    res.status(201).json({ mensaje: 'Venta registrada', id_venta });

  } catch (err) {
    await client.query('ROLLBACK');
    res.status(400).json({ error: err.message });
  } finally {
    client.release();
  }
});

module.exports = router;