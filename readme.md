# 🛒 Proyecto 2 — Sistema de Gestión de Tienda

Aplicación web fullstack para gestionar inventario, clientes y ventas de una tienda. Desarrollada para el curso **cc3088 - Bases de Datos 1**, Universidad del Valle de Guatemala, Ciclo 1 2026.

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite + React Router |
| Backend | Node.js + Express |
| Base de datos | PostgreSQL 15 |
| Autenticación | express-session + bcryptjs |
| Infraestructura | Docker + Docker Compose |

---

## Requisitos previos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y corriendo
- No se requiere Node.js, PostgreSQL ni ninguna otra dependencia local

---

## Levantar el proyecto desde cero

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd proyecto2

# 2. Crear el archivo de variables de entorno
cp .env.example .env

# 3. Levantar toda la infraestructura
docker compose up --build
```

La base de datos se inicializa automáticamente con tablas y datos de prueba al primer arranque.

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
| Usuario | `proy2` |
| Contraseña | `secret` |
| Base de datos | `tienda` |

### Aplicación web (login)
| Campo | Valor |
|-------|-------|
| Usuario | `admin` |
| Contraseña | `admin123` |

---

## Estructura del proyecto

```
proyecto2/
├── docker-compose.yml
├── .env.example
├── db/
│   ├── ddl.sql          # Esquema + índices + vista + usuario admin
│   └── scriptDatos.sql  # 25+ registros por tabla
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── index.js         # Servidor + sesión + middleware auth
│       ├── db.js            # Pool de conexión PostgreSQL
│       └── routes/
│           ├── auth.js      # login, logout, /me
│           ├── productos.js # CRUD + JOIN + Subquery
│           ├── clientes.js  # CRUD + Subquery IN
│           ├── ventas.js    # CRUD + JOIN + Transacción
│           └── reportes.js  # VIEW + CTE + GROUP BY/HAVING
└── frontend/
    ├── Dockerfile
    ├── package.json
    └── src/
        ├── App.jsx          # AuthContext + rutas protegidas
        ├── main.jsx
        ├── index.css        # Tema oscuro/claro con CSS variables
        └── pages/
            ├── Login.jsx
            ├── Productos.jsx
            ├── Clientes.jsx
            ├── Ventas.jsx
            └── Reportes.jsx
```

---

## Funcionalidades implementadas

### CRUD
- **Productos**: crear, editar, eliminar — con categoría y proveedor
- **Clientes**: crear, editar, eliminar

### SQL visible en la UI
| Técnica | Dónde se usa |
|---------|-------------|
| JOIN (3) | Productos con categoría/proveedor · Ventas con cliente/empleado · Detalle de venta con productos |
| Subquery IN | Clientes con ventas registradas |
| Subquery en FROM | Productos con stock menor al promedio |
| GROUP BY + HAVING | Clientes frecuentes (más de 1 venta) |
| CTE — WITH | Ventas totales por cliente ordenadas por monto |
| VIEW | `reporte_ventas` — total por venta |
| Transacción explícita | Registro de venta: BEGIN / INSERT / UPDATE stock / COMMIT — con ROLLBACK si stock insuficiente |

### Avanzado
- **Autenticación**: login/logout con sesión persistida en PostgreSQL (`express-session` + `connect-pg-simple`)
- **Exportar CSV**: botón en cada reporte (ventas, clientes frecuentes, bajo stock)
- **Modo oscuro / claro**: toggle en el nav, preferencia guardada en `localStorage`

### Otras características
- Mensajes de error y éxito visibles al usuario en todas las operaciones
- Estadísticas en tiempo real por página (stat cards)
- Badges de color para identificar técnicas SQL usadas
- Alertas de stock bajo destacadas en rojo

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
DB_USER=proy2
DB_PASSWORD=secret
DB_NAME=tienda
DB_HOST=db
DB_PORT=5432
PORT=3001
```