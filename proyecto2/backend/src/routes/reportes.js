const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET reporte de ventas totales por venta (VIEW)
router.get('/ventas-totales', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM reporte_ventas ORDER BY id_venta
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ventas totales usando CTE (WITH)
router.get('/cte-ventas', async (req, res) => {
  try {
    const result = await pool.query(`
      WITH ventas_totales AS (
        SELECT v.id_venta,
               c.nombre AS cliente,
               SUM(d.cantidad * d.precio_unitario) AS total
        FROM detalle_venta d
        JOIN venta v ON d.id_venta = v.id_venta
        JOIN cliente c ON v.id_cliente = c.id_cliente
        GROUP BY v.id_venta, c.nombre
      )
      SELECT * FROM ventas_totales ORDER BY total DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET clientes con mas de 1 venta (GROUP BY + HAVING)
router.get('/clientes-frecuentes', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.nombre, COUNT(*) AS total_ventas
      FROM venta v
      JOIN cliente c ON v.id_cliente = c.id_cliente
      GROUP BY c.nombre
      HAVING COUNT(*) > 1
      ORDER BY total_ventas DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;