CREATE TABLE categoria (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE proveedor (
    id_proveedor SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20)
);

CREATE TABLE producto (
    id_producto SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio NUMERIC(10,2) NOT NULL,
    stock INT NOT NULL CHECK (stock >= 0),
    id_categoria INT REFERENCES categoria(id_categoria),
    id_proveedor INT REFERENCES proveedor(id_proveedor)
);

CREATE TABLE cliente (
    id_cliente SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    correo VARCHAR(100)
);

CREATE TABLE empleado (
    id_empleado SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    puesto VARCHAR(50)
);

CREATE TABLE venta (
    id_venta SERIAL PRIMARY KEY,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_cliente INT REFERENCES cliente(id_cliente),
    id_empleado INT REFERENCES empleado(id_empleado)
);

CREATE TABLE detalle_venta (
    id_detalle SERIAL PRIMARY KEY,
    id_venta INT REFERENCES venta(id_venta),
    id_producto INT REFERENCES producto(id_producto),
    cantidad INT CHECK (cantidad > 0),
    precio_unitario NUMERIC(10,2)
);

-- Tabla de usuarios para autenticación
CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    nombre     VARCHAR(100) NOT NULL,
    usuario    VARCHAR(50)  NOT NULL UNIQUE,
    password_hash TEXT      NOT NULL,
    rol        VARCHAR(20)  NOT NULL DEFAULT 'rol_consulta'
);

CREATE INDEX idx_producto_categoria ON producto(id_categoria);
CREATE INDEX idx_venta_cliente      ON venta(id_cliente);

CREATE VIEW reporte_ventas AS
SELECT v.id_venta, SUM(d.cantidad * d.precio_unitario) AS total
FROM venta v
JOIN detalle_venta d ON v.id_venta = d.id_venta
GROUP BY v.id_venta;

-- =============================================
-- ROLES EN EL DBMS
-- =============================================

-- Crear roles
CREATE ROLE rol_admin;
CREATE ROLE rol_gerente;
CREATE ROLE rol_vendedor;
CREATE ROLE rol_cajero;
CREATE ROLE rol_consulta;

-- rol_admin: acceso total
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO rol_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO rol_admin;

-- rol_gerente: ver y editar productos/categorias/proveedores/clientes, ver reportes, no puede tocar usuarios
GRANT SELECT, INSERT, UPDATE ON producto, categoria, proveedor, cliente, empleado TO rol_gerente;
GRANT SELECT ON venta, detalle_venta, reporte_ventas TO rol_gerente;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO rol_gerente;

-- rol_vendedor: crear ventas, ver productos y clientes
GRANT SELECT ON producto, categoria, proveedor, cliente, empleado TO rol_vendedor;
GRANT SELECT, INSERT ON venta, detalle_venta TO rol_vendedor;
GRANT USAGE, SELECT ON SEQUENCE venta_id_venta_seq, detalle_venta_id_detalle_seq TO rol_vendedor;

-- rol_cajero: solo ver ventas y reportes
GRANT SELECT ON venta, detalle_venta, reporte_ventas, cliente, empleado, producto TO rol_cajero;

-- rol_consulta: solo lectura en todas las tablas
GRANT SELECT ON ALL TABLES IN SCHEMA public TO rol_consulta;

-- Usuarios de prueba (uno por rol) — contraseña = usuario + "123"
-- admin123, gerente123, vendedor123, cajero123, consulta123
INSERT INTO usuario (nombre, usuario, password_hash, rol) VALUES
('Administrador', 'admin',    '$2b$10$LQw19STdbeB6hmVtyhnznuOQS4jH6Xyi2hs2.8vKJ7HQvNsOl06oa', 'rol_admin'),
('Gerente',       'gerente',  '$2b$10$qJnKgxycGsIOVQtILyQc6Oy2n6bqHwQ4bWrbKLOlAyd8wfDiYJPZS', 'rol_gerente'),
('Vendedor',      'vendedor', '$2b$10$NxeopEAJagmxYKwWM8NkH.r4IXScZ41HbsbdUdxeR4VG7xu7sE4SS', 'rol_vendedor'),
('Cajero',        'cajero',   '$2b$10$DWTZ.LHQYOgja2kljDAhhuaVp8g.7E4TTFjHGG2ICQ8.7zh3AFfLa', 'rol_cajero'),
('Consulta',      'consulta', '$2b$10$r2h1dwWcWZUuWWnPPYYHc.phsXw4Ci8Fgnl18QuU.RUQlhiiNWNWW', 'rol_consulta');