-- =========================
-- INSERT DATA SCRIPT
-- =========================

-- CATEGORIA
INSERT INTO categoria (nombre) VALUES
('Electrónica'), ('Ropa'), ('Hogar'), ('Deportes'), ('Juguetes'),
('Libros'), ('Belleza'), ('Automotriz'), ('Computación'), ('Accesorios'),
('Calzado'), ('Oficina'), ('Salud'), ('Música'), ('Videojuegos'),
('Mascotas'), ('Jardín'), ('Herramientas'), ('Bebidas'), ('Comida'),
('Tecnología'), ('Decoración'), ('Arte'), ('Fotografía'), ('Viajes');

-- PROVEEDOR
INSERT INTO proveedor (nombre, telefono) VALUES
('Proveedor 1','1001'),('Proveedor 2','1002'),('Proveedor 3','1003'),
('Proveedor 4','1004'),('Proveedor 5','1005'),('Proveedor 6','1006'),
('Proveedor 7','1007'),('Proveedor 8','1008'),('Proveedor 9','1009'),
('Proveedor 10','1010'),('Proveedor 11','1011'),('Proveedor 12','1012'),
('Proveedor 13','1013'),('Proveedor 14','1014'),('Proveedor 15','1015'),
('Proveedor 16','1016'),('Proveedor 17','1017'),('Proveedor 18','1018'),
('Proveedor 19','1019'),('Proveedor 20','1020'),('Proveedor 21','1021'),
('Proveedor 22','1022'),('Proveedor 23','1023'),('Proveedor 24','1024'),
('Proveedor 25','1025');

-- CLIENTE
INSERT INTO cliente (nombre, correo) VALUES
('Juan Perez','juan@mail.com'),('Maria Lopez','maria@mail.com'),
('Carlos Ruiz','carlos@mail.com'),('Ana Torres','ana@mail.com'),
('Luis Gomez','luis@mail.com'),('Sofia Martinez','sofia@mail.com'),
('Pedro Castillo','pedro@mail.com'),('Lucia Herrera','lucia@mail.com'),
('Diego Morales','diego@mail.com'),('Valeria Cruz','valeria@mail.com'),
('Andres Flores','andres@mail.com'),('Paula Reyes','paula@mail.com'),
('Jorge Mendoza','jorge@mail.com'),('Camila Rojas','camila@mail.com'),
('Fernando Diaz','fernando@mail.com'),('Elena Vargas','elena@mail.com'),
('Oscar Navarro','oscar@mail.com'),('Daniela Castro','daniela@mail.com'),
('Ricardo Silva','ricardo@mail.com'),('Patricia Luna','patricia@mail.com'),
('Miguel Chavez','miguel@mail.com'),('Andrea Soto','andrea@mail.com'),
('Roberto Vega','roberto@mail.com'),('Gabriela Ortiz','gabriela@mail.com'),
('Hector Ramos','hector@mail.com');

-- EMPLEADO
INSERT INTO empleado (nombre, puesto) VALUES
('Empleado 1','Vendedor'),('Empleado 2','Cajero'),
('Empleado 3','Gerente'),('Empleado 4','Vendedor'),
('Empleado 5','Cajero'),('Empleado 6','Vendedor'),
('Empleado 7','Supervisor'),('Empleado 8','Vendedor'),
('Empleado 9','Cajero'),('Empleado 10','Gerente'),
('Empleado 11','Vendedor'),('Empleado 12','Cajero'),
('Empleado 13','Supervisor'),('Empleado 14','Vendedor'),
('Empleado 15','Cajero'),('Empleado 16','Vendedor'),
('Empleado 17','Gerente'),('Empleado 18','Vendedor'),
('Empleado 19','Cajero'),('Empleado 20','Supervisor'),
('Empleado 21','Vendedor'),('Empleado 22','Cajero'),
('Empleado 23','Gerente'),('Empleado 24','Vendedor'),
('Empleado 25','Supervisor');

-- PRODUCTO
INSERT INTO producto (nombre, precio, stock, id_categoria, id_proveedor) VALUES
('Laptop',800,10,1,1),('Camisa',20,50,2,2),
('Silla',35,30,3,3),('Balon',25,40,4,4),
('Muñeca',15,60,5,5),('Libro A',10,70,6,6),
('Perfume',50,20,7,7),('Aceite',30,25,8,8),
('Teclado',45,15,9,9),('Reloj',60,10,10,10),
('Zapatos',55,35,11,11),('Cuaderno',5,100,12,12),
('Vitaminas',20,45,13,13),('Guitarra',120,5,14,14),
('Videojuego',70,12,15,15),('Comida perro',40,18,16,16),
('Maceta',22,27,17,17),('Martillo',18,33,18,18),
('Refresco',2,200,19,19),('Pizza',8,90,20,20),
('Tablet',300,8,21,21),('Cuadro',75,6,22,22),
('Pintura',40,14,23,23),('Camara',500,3,24,24),
('Maleta',150,9,25,25);

-- VENTA
INSERT INTO venta (id_cliente, id_empleado) VALUES
(1,1),(2,2),(3,3),(4,4),(5,5),
(6,6),(7,7),(8,8),(9,9),(10,10),
(11,11),(12,12),(13,13),(14,14),(15,15),
(16,16),(17,17),(18,18),(19,19),(20,20),
(21,21),(22,22),(23,23),(24,24),(25,25);

-- DETALLE_VENTA
INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario) VALUES
(1,1,1,800),(2,2,2,20),(3,3,1,35),(4,4,2,25),(5,5,3,15),
(6,6,1,10),(7,7,1,50),(8,8,2,30),(9,9,1,45),(10,10,1,60),
(11,11,2,55),(12,12,5,5),(13,13,1,20),(14,14,1,120),(15,15,1,70),
(16,16,2,40),(17,17,1,22),(18,18,3,18),(19,19,10,2),(20,20,2,8),
(21,21,1,300),(22,22,1,75),(23,23,2,40),(24,24,1,500),(25,25,1,150);