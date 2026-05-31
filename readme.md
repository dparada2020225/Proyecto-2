# 🛒 Proyecto 3 — Sistema de Gestión de Tienda

Extensión del Proyecto 2 con seguridad a nivel de base de datos: roles y permisos, stored procedures y ORM.
Desarrollado para **cc3088 - Bases de Datos 1**, Universidad del Valle de Guatemala, Ciclo 1 2026.

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite + React Router |
| Backend | Node.js + Express + Sequelize ORM |
| Base de datos | PostgreSQL 15 |
| Autenticación | express-session + bcryptjs |
| Infraestructura | Docker + Docker Compose |

---

## Levantar el proyecto desde cero

> El proyecto debe ejecutarse desde la rama `proyecto-3`.

```bash
# 1. Clonar el repositorio y cambiar a la rama correcta
git clone https://github.com/dparada2020225/Proyecto-2
cd Proyecto-2
git checkout proyecto-3
cd proyecto3

# 2. Crear el archivo de variables de entorno
cp .env.example .env

# 3. Levantar toda la infraestructura
docker compose up --build
```

La base de datos se inicializa automáticamente con tablas, roles, stored procedures y datos de prueba.

### URLs de acceso

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3001 |
| PostgreSQL | localhost:5432 |

---

## Credenciales

### Base de datos (fijas para calificación)
| Campo | Valor |
|-------|-------|
| Usuario | `proy3` |
| Contraseña | `secret` |
| Base de datos | `tienda` |

### Usuarios de prueba por rol

| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| admin | admin123 | rol_admin |
| gerente | gerente123 | rol_gerente |
| vendedor | vendedor123 | rol_vendedor |
| cajero | cajero123 | rol_cajero |
| consulta | consulta123 | rol_consulta |

---

## Esquema de roles

Los roles están definidos directamente en el DBMS de PostgreSQL mediante `CREATE ROLE`, `GRANT` y `REVOKE`.

### rol_admin
- **Descripción:** Acceso total al sistema.
- **Permisos:** `ALL PRIVILEGES` en todas las tablas y secuencias.
- **UI:** Puede ver, crear, editar y eliminar en todas las secciones.

### rol_gerente
- **Descripción:** Gestión de inventario y clientes. No puede tocar usuarios ni eliminar registros.
- **Permisos:**
  - `SELECT, INSERT, UPDATE` en: `producto`, `categoria`, `proveedor`, `cliente`, `empleado`
  - `SELECT` en: `venta`, `detalle_venta`, `reporte_ventas`
- **UI:** Puede ver y editar Productos y Clientes. Ve Reportes. No puede eliminar ni crear ventas.

### rol_vendedor
- **Descripción:** Registro de ventas. Solo lectura en catálogo.
- **Permisos:**
  - `SELECT` en: `producto`, `categoria`, `proveedor`, `cliente`, `empleado`
  - `SELECT, INSERT` en: `venta`, `detalle_venta`
- **UI:** Ve Productos y Clientes (sin editar). Puede crear y ver Ventas. Sin acceso a Reportes.

### rol_cajero
- **Descripción:** Consulta de ventas y reportes. Sin capacidad de modificar nada.
- **Permisos:**
  - `SELECT` en: `venta`, `detalle_venta`, `reporte_ventas`, `cliente`, `empleado`, `producto`
- **UI:** Ve Ventas y Reportes. Sin acceso a Productos ni Clientes.

### rol_consulta
- **Descripción:** Acceso de solo lectura a todo el sistema.
- **Permisos:**
  - `SELECT` en todas las tablas.
- **UI:** Puede ver todas las secciones pero sin crear, editar ni eliminar nada.

---

## Stored Procedures

Los stored procedures se definen en `db/procedures.sql` y son invocados desde el backend en `/api/procedimientos`.

| Procedure | Tipo | Descripción |
|-----------|------|-------------|
| `sp_registrar_venta` | PROCEDURE | Registra una venta completa con transacción explícita (COMMIT/ROLLBACK). Parámetro INOUT para retornar el ID generado. |
| `sp_crear_producto` | FUNCTION | Crea un producto con validación de precio y stock. Parámetros OUT para id y mensaje de resultado. |
| `sp_actualizar_stock` | FUNCTION | Ajusta el stock de un producto (positivo/negativo). Parámetro INOUT para retornar el stock resultante. |
| `sp_eliminar_cliente` | FUNCTION | Elimina un cliente validando que no tenga ventas asociadas. Parámetros OUT para resultado y mensaje. |
| `sp_reporte_empleado` | FUNCTION | Retorna todas las ventas de un empleado con totales. |

---

## ORM

Se utiliza **Sequelize** para las operaciones CRUD de la aplicación:

- `Producto.findAll()`, `Producto.create()`, `Producto.update()`, `Producto.destroy()`
- `Cliente.findAll()`, `Cliente.create()`, `Cliente.update()`, `Cliente.destroy()`
- `Venta.create()`, `Venta.findAll()` con `include` (asociaciones)
- `DetalleVenta.create()`, `DetalleVenta.findAll()`
- `Usuario.findOne()` para autenticación
- Transacciones con `sequelize.transaction()` y rollback automático

Las consultas avanzadas (subqueries, CTEs, reportes) se complementan con SQL explícito.

---

## Estructura del proyecto

```
proyecto3/
├── docker-compose.yml
├── .env.example
├── db/
│   ├── ddl.sql           # Tablas + roles + índices + vista + usuarios
│   ├── scriptDatos.sql   # 25+ registros por tabla
│   └── procedures.sql    # 5 stored procedures
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── index.js              # Servidor + sesión + rutas
│       ├── db.js                 # Pool pg para SQL directo
│       ├── orm.js                # Sequelize + modelos
│       └── routes/
│           ├── auth.js           # login, logout, /me (ORM)
│           ├── productos.js      # CRUD ORM + subquery SQL
│           ├── clientes.js       # CRUD ORM + subquery SQL
│           ├── ventas.js         # CRUD ORM + transacción Sequelize
│           ├── reportes.js       # VIEW + CTE + GROUP BY/HAVING
│           └── procedimientos.js # Invocación de los 5 SPs
└── frontend/
    ├── Dockerfile
    ├── package.json
    └── src/
        ├── App.jsx          # AuthContext + RoleRoute + nav por rol
        ├── permisos.js      # Definición de permisos por rol
        └── pages/
            ├── Login.jsx
            ├── Productos.jsx  # UI protegida por rol
            ├── Clientes.jsx   # UI protegida por rol
            ├── Ventas.jsx     # UI protegida por rol
            └── Reportes.jsx
```

---

## Detener y limpiar

```bash
# Detener los contenedores
docker compose down

# Detener Y borrar la base de datos (para reiniciar desde cero)
docker compose down -v
```

---

## Variables de entorno (.env.example)

```env
DB_USER=proy3
DB_PASSWORD=secret
DB_NAME=tienda
DB_HOST=db
DB_PORT=5432
PORT=3001
```
