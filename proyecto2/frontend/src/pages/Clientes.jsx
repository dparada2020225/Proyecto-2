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
    setError('')
    setMensaje('')
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
    setMensaje(editId ? 'Cliente actualizado' : 'Cliente creado')
    setForm({ nombre: '', correo: '' })
    setEditId(null)
    cargarClientes()
    fetch(`${API}/clientes/con-ventas`).then(r => r.json()).then(setConVentas)
  }

  const handleEditar = (c) => {
    setEditId(c.id_cliente)
    setForm({ nombre: c.nombre, correo: c.correo })
    setError('')
    setMensaje('')
  }

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar este cliente?')) return
    const res = await fetch(`${API}/clientes/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (!res.ok) { setError(data.error); return }
    setMensaje('Cliente eliminado')
    cargarClientes()
  }

  return (
    <div>
      <h2>Clientes</h2>

      {error && <div style={styles.error}>{error}</div>}
      {mensaje && <div style={styles.ok}>{mensaje}</div>}

      <div style={styles.form}>
        <h3>{editId ? 'Editar Cliente' : 'Nuevo Cliente'}</h3>
        <input style={styles.input} placeholder="Nombre" value={form.nombre}
          onChange={e => setForm({ ...form, nombre: e.target.value })} />
        <input style={styles.input} placeholder="Correo" value={form.correo}
          onChange={e => setForm({ ...form, correo: e.target.value })} />
        <button style={styles.btn} onClick={handleSubmit}>{editId ? 'Actualizar' : 'Crear'}</button>
        {editId && <button style={styles.btnGris} onClick={() => { setEditId(null); setForm({ nombre: '', correo: '' }) }}>Cancelar</button>}
      </div>

      <table style={styles.tabla}>
        <thead>
          <tr><th>ID</th><th>Nombre</th><th>Correo</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {clientes.map(c => (
            <tr key={c.id_cliente}>
              <td>{c.id_cliente}</td>
              <td>{c.nombre}</td>
              <td>{c.correo}</td>
              <td>
                <button style={styles.btnSm} onClick={() => handleEditar(c)}>Editar</button>
                <button style={styles.btnRojo} onClick={() => handleEliminar(c.id_cliente)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ marginTop: '32px' }}>Clientes con ventas registradas (Subquery)</h3>
      <table style={styles.tabla}>
        <thead>
          <tr><th>Nombre</th><th>Correo</th></tr>
        </thead>
        <tbody>
          {conVentas.map((c, i) => (
            <tr key={i}>
              <td>{c.nombre}</td>
              <td>{c.correo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const styles = {
  form: { background: '#f5f5f5', padding: '16px', borderRadius: '8px', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' },
  input: { padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' },
  btn: { padding: '8px 16px', background: '#1e1e2e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  btnGris: { padding: '8px 16px', background: '#888', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  btnSm: { padding: '4px 10px', background: '#4a90e2', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '4px' },
  btnRojo: { padding: '4px 10px', background: '#e25555', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  tabla: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
  error: { background: '#fdd', border: '1px solid #e25555', padding: '10px', borderRadius: '4px', marginBottom: '12px', color: '#c00' },
  ok: { background: '#dfd', border: '1px solid #4caf50', padding: '10px', borderRadius: '4px', marginBottom: '12px', color: '#2a7a2a' },
}