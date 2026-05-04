# Proyecto 2 - Tienda

Aplicación web para gestión de inventario y ventas.

## Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Base de datos: PostgreSQL
- Infraestructura: Docker

## Requisitos
- Docker Desktop instalado y corriendo

## Levantar el proyecto

1. Clonar el repositorio:
   git clone <url-del-repo>
   cd proyecto2

2. Crear el archivo .env basado en el ejemplo:
   cp .env.example .env

3. Levantar todo con Docker:
   docker compose up --build

## URLs
- Frontend: http://localhost:5173
- Backend:  http://localhost:3001
- Base de datos: localhost:5432

## Credenciales de base de datos
- Usuario: proy2
- Contraseña: secret
- Base de datos: tienda

## Detener el proyecto
   docker compose down