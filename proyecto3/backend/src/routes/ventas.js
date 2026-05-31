const express = require('express');
const router = express.Router();
const { sequelize, Venta, DetalleVenta, Cliente, Empleado, Producto } = require('../orm');

// GET todas las ventas con cliente y empleado (ORM)
router.get('/', async (req, res) => {
  try {
    const ventas = await Venta.findAll({
      include: [
        { model: Cliente,  attributes: ['nombre'] },
        { model: Empleado, attributes: ['nombre'] },
      ],
      order: [['id_venta', 'DESC']],
    });
    const result = ventas.map(v => ({
      id_venta: v.id_venta,
      fecha:    v.fecha,
      cliente:  v.cliente?.nombre,
      empleado: v.empleado?.nombre,
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET detalle de una venta con productos (ORM)
router.get('/:id/detalle', async (req, res) => {
  const { id } = req.params;
  try {
    const detalles = await DetalleVenta.findAll({
      where: { id_venta: id },
      include: [{ model: Producto, attributes: ['nombre'] }],
    });
    const result = detalles.map(d => ({
      id_venta:        d.id_venta,
      producto:        d.producto?.nombre,
      cantidad:        d.cantidad,
      precio_unitario: d.precio_unitario,
      subtotal:        d.cantidad * d.precio_unitario,
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET empleados (ORM)
router.get('/empleados', async (req, res) => {
  try {
    const empleados = await Empleado.findAll({ order: [['nombre', 'ASC']] });
    res.json(empleados);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST crear venta con detalle (transacción explícita con ORM)
router.post('/', async (req, res) => {
  const { id_cliente, id_empleado, detalle } = req.body;

  const t = await sequelize.transaction();
  try {
    // Insertar venta
    const venta = await Venta.create({ id_cliente, id_empleado }, { transaction: t });

    // Insertar cada detalle y descontar stock
    for (const item of detalle) {
      await DetalleVenta.create({
        id_venta:        venta.id_venta,
        id_producto:     item.id_producto,
        cantidad:        item.cantidad,
        precio_unitario: item.precio_unitario,
      }, { transaction: t });

      // Descontar stock
      const producto = await Producto.findByPk(item.id_producto, { transaction: t });
      if (!producto || producto.stock < item.cantidad) {
        throw new Error(`Stock insuficiente para producto id ${item.id_producto}`);
      }
      await producto.update({ stock: producto.stock - item.cantidad }, { transaction: t });
    }

    await t.commit();
    res.status(201).json({ mensaje: 'Venta registrada', id_venta: venta.id_venta });

  } catch (err) {
    await t.rollback();
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
