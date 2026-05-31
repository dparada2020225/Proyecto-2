const express = require('express');
const router = express.Router();
const pool = require('../db');

// SP 1: Registrar venta completa (transacción con ROLLBACK dentro del SP)
router.post('/registrar-venta', async (req, res) => {
  const { id_cliente, id_empleado, detalle } = req.body;
  try {
    const result = await pool.query(
      'CALL sp_registrar_venta($1, $2, $3, $4)',
      [id_cliente, id_empleado, JSON.stringify(detalle), 0]
    );
    const id_venta = result.rows[0]?.p_id_venta;
    res.status(201).json({ mensaje: 'Venta registrada', id_venta });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// SP 2: Crear producto con validación (OUT params)
router.post('/crear-producto', async (req, res) => {
  const { nombre, precio, stock, id_categoria, id_proveedor } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM sp_crear_producto($1, $2, $3, $4, $5)',
      [nombre, precio, stock, id_categoria, id_proveedor]
    );
    const { p_id_producto, p_mensaje } = result.rows[0];
    if (p_id_producto === -1) {
      return res.status(400).json({ error: p_mensaje });
    }
    res.status(201).json({ id_producto: p_id_producto, mensaje: p_mensaje });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SP 3: Actualizar stock (INOUT param)
router.put('/actualizar-stock/:id', async (req, res) => {
  const { id } = req.params;
  const { cantidad } = req.body; // positivo = agregar, negativo = restar
  try {
    const result = await pool.query(
      'SELECT sp_actualizar_stock($1, $2, $3)',
      [id, cantidad, 0]
    );
    const stock_nuevo = result.rows[0]?.sp_actualizar_stock;
    res.json({ mensaje: 'Stock actualizado', stock_nuevo });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// SP 4: Eliminar cliente con validación (OUT params)
router.delete('/eliminar-cliente/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM sp_eliminar_cliente($1)',
      [id]
    );
    const { p_ok, p_mensaje } = result.rows[0];
    if (!p_ok) return res.status(400).json({ error: p_mensaje });
    res.json({ mensaje: p_mensaje });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// SP 5: Reporte de ventas por empleado
router.get('/reporte-empleado/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM sp_reporte_empleado($1)',
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
