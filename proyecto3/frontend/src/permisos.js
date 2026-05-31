// Definición de permisos por rol
// 'full' = crear + editar + eliminar
// 'edit' = crear + editar (sin eliminar)
// 'read' = solo lectura
// false  = sin acceso a la página

export const PERMISOS = {
  rol_admin:    { productos: 'full', clientes: 'full', ventas: 'full', reportes: true },
  rol_gerente:  { productos: 'edit', clientes: 'edit', ventas: 'read', reportes: true },
  rol_vendedor: { productos: 'read', clientes: 'read', ventas: 'full', reportes: false },
  rol_cajero:   { productos: false,  clientes: false,  ventas: 'read', reportes: true },
  rol_consulta: { productos: 'read', clientes: 'read', ventas: 'read', reportes: true },
}

export function puedeVer(rol, seccion) {
  return !!PERMISOS[rol]?.[seccion]
}

export function puedeMutar(rol, seccion) {
  const p = PERMISOS[rol]?.[seccion]
  return p === 'full' || p === 'edit'
}

export function puedeEliminar(rol, seccion) {
  return PERMISOS[rol]?.[seccion] === 'full'
}
