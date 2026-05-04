import { useEffect, useState } from 'react'

const API = 'http://localhost:3001/api'

export default function Clientes() {
  const [clientes, setClientes] = useState([])
  const [conVentas, setConVentas] = useState([])
  const [form, setForm] = useState({ nombre: '', correo: '' })
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    cargarClientes()
    fetch(`${API}/clientes/con-ventas`).then(r => r.json()).then(setConVentas)
  }, [])

  const cargarClientes = () => {
    fetch(`${API}/clientes`)
      .then(r => r.json())
      .then(setClientes)
      .catch(() => setError('Error al cargar clientes'))
  }

  const handleSubmit = async () => {
    setError(''); setMensaje('')
    if (!form.nombre || !form.correo) {
      setError('Nombre y correo son obligatorios')
      return
    }
    const url = editId ? `${API}/clientes/${editId}` : `${API}/clientes`
    const method = editId ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); return }
    setMensaje(editId ? 'Cliente actualizado correctamente' : 'Cliente creado correctamente')
    setForm({ nombre: '', correo: '' })
    setEditId(null)
    cargarClientes()
    fetch(`${API}/clientes/con-ventas`).then(r => r.json()).then(setConVentas)
  }

  const handleEditar = (c) => {
    setEditId(c.id_cliente)
    setForm({ nombre: c.nombre, correo: c.correo })
    setError(''); setMensaje('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar este cliente?')) return
    const res = await fetch(`${API}/clientes/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (!res.ok) { setError(data.error); return }
    setMensaje('Cliente eliminado')
    cargarClientes()
  }

  const cancelar = () => {
    setEditId(null)
    setForm({ nombre: '', correo: '' })
    setError(''); setMensaje('')
  }

  return (
    <div className="animate-in">
      <div className="page-header">
        <h1 className="page-title">Clientes</h1>
        <p className="page-subtitle">Registro y gestión de clientes</p>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-value">{clientes.length}</div>
          <div className="stat-label">Total clientes</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{conVentas.length}</div>
          <div className="stat-label">Con compras</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{clientes.length - conVentas.length}</div>
          <div className="stat-label">Sin compras</div>
        </div>
      </div>

      {error && <div className="alert alert-error">⚠ {error}</div>}
      {mensaje && <div className="alert alert-success">✓ {mensaje}</div>}

      <div className="card">
        <div className="card-title">{editId ? '✏ Editar cliente' : '＋ Nuevo cliente'}</div>
        <div className="form-row">
          <input placeholder="Nombre completo" value={form.nombre}
            onChange={e => setForm({ ...form, nombre: e.target.value })} style={{ minWidth: 200 }} />
          <input placeholder="Correo electrónico" value={form.correo}
            onChange={e => setForm({ ...form, correo: e.target.value })} style={{ minWidth: 220 }} />
          <button className="btn btn-primary" onClick={handleSubmit}>
            {editId ? 'Actualizar' : 'Crear cliente'}
          </button>
          {editId && (
            <button className="btn btn-ghost" onClick={cancelar}>Cancelar</button>
          )}
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="card-title" style={{ padding: '20px 24px 0' }}>Todos los clientes</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map(c => (
                <tr key={c.id_cliente}>
                  <td className="td-id">#{c.id_cliente}</td>
                  <td style={{ fontWeight: 500 }}>{c.nombre}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{c.correo}</td>
                  <td>
                    <div className="td-actions">
                      <button className="btn btn-sm btn-edit" onClick={() => handleEditar(c)}>Editar</button>
                      <button className="btn btn-sm btn-delete" onClick={() => handleEliminar(c.id_cliente)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="card-title" style={{ padding: '20px 24px 0' }}>
          Clientes con ventas registradas
          <span className="badge badge-purple" style={{ fontSize: 11, marginLeft: 8 }}>Subquery IN</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
              </tr>
            </thead>
            <tbody>
              {conVentas.map((c, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500 }}>{c.nombre}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{c.correo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}