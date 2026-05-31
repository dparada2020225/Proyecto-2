const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
  }
);

// ── Modelos ──────────────────────────────────────────────

const Categoria = sequelize.define('categoria', {
  id_categoria: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre:       { type: DataTypes.STRING(100), allowNull: false },
}, { timestamps: false });

const Proveedor = sequelize.define('proveedor', {
  id_proveedor: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre:       { type: DataTypes.STRING(100), allowNull: false },
  telefono:     { type: DataTypes.STRING(20) },
}, { timestamps: false });

const Producto = sequelize.define('producto', {
  id_producto:  { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre:       { type: DataTypes.STRING(100), allowNull: false },
  precio:       { type: DataTypes.DECIMAL(10,2), allowNull: false },
  stock:        { type: DataTypes.INTEGER, allowNull: false },
  id_categoria: { type: DataTypes.INTEGER },
  id_proveedor: { type: DataTypes.INTEGER },
}, { timestamps: false });

const Cliente = sequelize.define('cliente', {
  id_cliente: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre:     { type: DataTypes.STRING(100) },
  correo:     { type: DataTypes.STRING(100) },
}, { timestamps: false });

const Empleado = sequelize.define('empleado', {
  id_empleado: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre:      { type: DataTypes.STRING(100) },
  puesto:      { type: DataTypes.STRING(50) },
}, { timestamps: false });

const Venta = sequelize.define('venta', {
  id_venta:    { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fecha:       { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  id_cliente:  { type: DataTypes.INTEGER },
  id_empleado: { type: DataTypes.INTEGER },
}, { timestamps: false });

const DetalleVenta = sequelize.define('detalle_venta', {
  id_detalle:      { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_venta:        { type: DataTypes.INTEGER },
  id_producto:     { type: DataTypes.INTEGER },
  cantidad:        { type: DataTypes.INTEGER },
  precio_unitario: { type: DataTypes.DECIMAL(10,2) },
}, { timestamps: false });

const Usuario = sequelize.define('usuario', {
  id_usuario:   { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre:       { type: DataTypes.STRING(100), allowNull: false },
  usuario:      { type: DataTypes.STRING(50), allowNull: false, unique: true },
  password_hash:{ type: DataTypes.TEXT, allowNull: false },
  rol:          { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'rol_consulta' },
}, { timestamps: false });

// ── Asociaciones ─────────────────────────────────────────
Producto.belongsTo(Categoria, { foreignKey: 'id_categoria' });
Producto.belongsTo(Proveedor, { foreignKey: 'id_proveedor' });
Venta.belongsTo(Cliente,  { foreignKey: 'id_cliente' });
Venta.belongsTo(Empleado, { foreignKey: 'id_empleado' });
DetalleVenta.belongsTo(Venta,    { foreignKey: 'id_venta' });
DetalleVenta.belongsTo(Producto, { foreignKey: 'id_producto' });

module.exports = { sequelize, Categoria, Proveedor, Producto, Cliente, Empleado, Venta, DetalleVenta, Usuario };
