-- =============================================
-- STORED PROCEDURES - Proyecto 3
-- =============================================

-- SP 1: Registrar venta completa con transacción explícita y ROLLBACK
-- Cubre: transacción con ROLLBACK dentro de un SP + parámetro INOUT
CREATE OR REPLACE PROCEDURE sp_registrar_venta(
  IN  p_id_cliente  INT,
  IN  p_id_empleado INT,
  IN  p_detalles    JSON,
  INOUT p_id_venta  INT
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_item      JSON;
  v_id_prod   INT;
  v_cantidad  INT;
  v_precio    NUMERIC(10,2);
  v_stock_act INT;
BEGIN
  -- Insertar venta
  INSERT INTO venta (id_cliente, id_empleado)
  VALUES (p_id_cliente, p_id_empleado)
  RETURNING id_venta INTO p_id_venta;

  -- Procesar cada producto del detalle
  FOR v_item IN SELECT * FROM json_array_elements(p_detalles)
  LOOP
    v_id_prod  := (v_item->>'id_producto')::INT;
    v_cantidad := (v_item->>'cantidad')::INT;
    v_precio   := (v_item->>'precio_unitario')::NUMERIC;

    -- Verificar que el producto existe y tiene stock suficiente
    SELECT stock INTO v_stock_act
    FROM producto
    WHERE id_producto = v_id_prod
    FOR UPDATE;

    IF v_stock_act IS NULL THEN
      RAISE EXCEPTION 'Producto % no encontrado', v_id_prod;
    END IF;

    IF v_stock_act < v_cantidad THEN
      RAISE EXCEPTION 'Stock insuficiente para producto %. Disponible: %, Solicitado: %',
        v_id_prod, v_stock_act, v_cantidad;
    END IF;

    -- Insertar detalle
    INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario)
    VALUES (p_id_venta, v_id_prod, v_cantidad, v_precio);

    -- Descontar stock
    UPDATE producto SET stock = stock - v_cantidad WHERE id_producto = v_id_prod;
  END LOOP;

  COMMIT;

EXCEPTION
  WHEN OTHERS THEN
    ROLLBACK;
    RAISE;
END;
$$;


-- SP 2: Crear producto con parámetros de salida y manejo de excepciones
-- Cubre: parámetros OUT + EXCEPTION
CREATE OR REPLACE FUNCTION sp_crear_producto(
  p_nombre       VARCHAR(100),
  p_precio       NUMERIC(10,2),
  p_stock        INT,
  p_id_categoria INT,
  p_id_proveedor INT,
  OUT p_id_producto INT,
  OUT p_mensaje     TEXT
)
RETURNS RECORD
LANGUAGE plpgsql
AS $$
BEGIN
  IF p_precio <= 0 THEN
    RAISE EXCEPTION 'El precio debe ser mayor a 0';
  END IF;
  IF p_stock < 0 THEN
    RAISE EXCEPTION 'El stock no puede ser negativo';
  END IF;

  INSERT INTO producto (nombre, precio, stock, id_categoria, id_proveedor)
  VALUES (p_nombre, p_precio, p_stock, p_id_categoria, p_id_proveedor)
  RETURNING id_producto INTO p_id_producto;

  p_mensaje := 'Producto creado correctamente';

EXCEPTION
  WHEN OTHERS THEN
    p_id_producto := -1;
    p_mensaje := SQLERRM;
END;
$$;


-- SP 3: Actualizar stock con parámetro INOUT y validación
-- Cubre: INOUT + EXCEPTION
CREATE OR REPLACE FUNCTION sp_actualizar_stock(
  IN    p_id_producto  INT,
  IN    p_cantidad     INT,
  INOUT p_stock_nuevo  INT
)
RETURNS INT
LANGUAGE plpgsql
AS $$
BEGIN
  SELECT stock INTO p_stock_nuevo
  FROM producto
  WHERE id_producto = p_id_producto;

  IF p_stock_nuevo IS NULL THEN
    RAISE EXCEPTION 'Producto % no encontrado', p_id_producto;
  END IF;

  IF p_stock_nuevo + p_cantidad < 0 THEN
    RAISE EXCEPTION 'Stock insuficiente. Stock actual: %, Ajuste solicitado: %',
      p_stock_nuevo, p_cantidad;
  END IF;

  UPDATE producto
  SET stock = stock + p_cantidad
  WHERE id_producto = p_id_producto
  RETURNING stock INTO p_stock_nuevo;

EXCEPTION
  WHEN OTHERS THEN
    p_stock_nuevo := -1;
    RAISE;
END;
$$;


-- SP 4: Eliminar cliente con validación (no elimina si tiene ventas)
-- Cubre: OUT + EXCEPTION + lógica de negocio
CREATE OR REPLACE FUNCTION sp_eliminar_cliente(
  p_id_cliente INT,
  OUT p_ok      BOOLEAN,
  OUT p_mensaje TEXT
)
RETURNS RECORD
LANGUAGE plpgsql
AS $$
DECLARE
  v_ventas INT;
BEGIN
  SELECT COUNT(*) INTO v_ventas FROM venta WHERE id_cliente = p_id_cliente;

  IF v_ventas > 0 THEN
    RAISE EXCEPTION 'No se puede eliminar: el cliente tiene % venta(s) registrada(s)', v_ventas;
  END IF;

  DELETE FROM cliente WHERE id_cliente = p_id_cliente;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Cliente % no encontrado', p_id_cliente;
  END IF;

  p_ok      := TRUE;
  p_mensaje := 'Cliente eliminado correctamente';

EXCEPTION
  WHEN OTHERS THEN
    p_ok      := FALSE;
    p_mensaje := SQLERRM;
END;
$$;


-- SP 5: Reporte de ventas por empleado
-- Cubre: función con parámetro de entrada que retorna tabla
CREATE OR REPLACE FUNCTION sp_reporte_empleado(p_id_empleado INT)
RETURNS TABLE (
  id_venta    INT,
  fecha       TIMESTAMP,
  cliente     VARCHAR(100),
  total_venta NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
  IF p_id_empleado IS NULL OR p_id_empleado <= 0 THEN
    RAISE EXCEPTION 'ID de empleado inválido';
  END IF;

  RETURN QUERY
    SELECT
      v.id_venta,
      v.fecha,
      c.nombre AS cliente,
      SUM(d.cantidad * d.precio_unitario) AS total_venta
    FROM venta v
    JOIN cliente c      ON v.id_cliente  = c.id_cliente
    JOIN detalle_venta d ON v.id_venta   = d.id_venta
    WHERE v.id_empleado = p_id_empleado
    GROUP BY v.id_venta, v.fecha, c.nombre
    ORDER BY v.fecha DESC;

EXCEPTION
  WHEN OTHERS THEN
    RAISE;
END;
$$;
