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

CREATE INDEX idx_producto_categoria ON producto(id_categoria);
CREATE INDEX idx_venta_cliente ON venta(id_cliente);