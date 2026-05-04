-- 1. JOIN (3 consultas)

-- 1
SELECT p.nombre, c.nombre
FROM producto p
JOIN categoria c ON p.id_categoria = c.id_categoria;

-- 2
SELECT v.id_venta, c.nombre, e.nombre
FROM venta v
JOIN cliente c ON v.id_cliente = c.id_cliente
JOIN empleado e ON v.id_empleado = e.id_empleado;

-- 3
SELECT v.id_venta, p.nombre, d.cantidad
FROM detalle_venta d
JOIN producto p ON d.id_producto = p.id_producto
JOIN venta v ON d.id_venta = v.id_venta;




-- 2. Subqueries

-- 1
SELECT nombre
FROM producto
WHERE stock < (SELECT AVG(stock) FROM producto);

-- 2
SELECT nombre
FROM cliente
WHERE id_cliente IN (SELECT id_cliente FROM venta);


-- 3. GROUP BY + HAVING
SELECT id_cliente, COUNT(*) AS total
FROM venta
GROUP BY id_cliente
HAVING COUNT(*) > 1;


-- 4. CTE (WITH)
WITH ventas_totales AS (
    SELECT id_venta, SUM(cantidad * precio_unitario) AS total
    FROM detalle_venta
    GROUP BY id_venta
)
SELECT * FROM ventas_totales;


-- 5. VIEW

CREATE VIEW reporte_ventas AS
SELECT v.id_venta, SUM(d.cantidad * d.precio_unitario) AS total
FROM venta v
JOIN detalle_venta d ON v.id_venta = d.id_venta
GROUP BY v.id_venta;


-- 6. Transacción (PostgreSQL)
DO $$
DECLARE
    v_id_venta INT;
BEGIN
    INSERT INTO venta (id_cliente, id_empleado)
    VALUES (1, 1)
    RETURNING id_venta INTO v_id_venta;

    INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario)
    VALUES (v_id_venta, 1, 2, 800.00);

    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE NOTICE 'Error en transacción: %', SQLERRM;
END;
$$;