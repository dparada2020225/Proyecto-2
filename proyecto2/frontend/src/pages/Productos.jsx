import { useEffect, useState } from 'react'

const API = 'http://localhost:3001/api'

export default function Productos() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [proveedores, setProveedores] = useState([])
  const [form, setForm] = useState({ nombre: '', precio: '', stock: '', id_categoria: '', id_proveedor: '' })
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    cargarProductos()
    fetch(`${API}/productos/categorias`).then(r => r.json()).then(setCategorias)
    fetch(`${API}/productos/proveedores`).then(r => r.json()).then(setProveedores)
  }, [])

  const cargarProductos = () => {
    fetch(`${API}/productos`)
      .then(r => r.json())
      .then(setProductos)
      .catch(() => setError('Error al cargar productos'))
  }

  const handleSubmit = async () => {
    setError('')
    setMensaje('')
    if (!form.nombre || !form.precio || !form.stock || !form.id_categoria || !form.id_proveedor) {
      setError('Todos los campos son obligatorios')
      return
    }
    const url = editId ? `${API}/productos/${editId}` : `${API}/productos`
    const method = editId ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); return }
    setMensaje(editId ? 'Producto actualizado' : 'Producto creado')
    setForm({ nombre: '', precio: '', stock: '', id_categoria: '', id_proveedor: '' })
    setEditId(null)
    cargarProductos()
  }

  const handleEditar = (p) => {
    setEditId(p.id_producto)
    setForm({ nombre: p.nombre, precio: p.precio, stock: p.stock, id_categoria: p.id_categoria, id_proveedor: p.id_proveedor })
    setError('')
    setMensaje('')
  }

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return
    const res = await fetch(`${API}/productos/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (!res.ok) { setError(data.error); return }
    setMensaje('Producto eliminado')
    cargarProductos()
  }

  return (
    <div>
      <h2>Productos</h2>

      {error && <div style={styles.error}>{error}</div>}
      {mensaje && <div style={styles.ok}>{mensaje}</div>}

      <div style={styles.form}>
        <h3>{editId ? 'Editar Producto' : 'Nuevo Producto'}</h3>
        <input style={styles.input} placeholder="Nombre" value={form.nombre}
          onChange={e => setForm({ ...form, nombre: e.target.value })} />
        <input style={styles.input} placeholder="Precio" type="number" value={form.precio}
          onChange={e => setForm({ ...form, precio: e.target.value })} />
        <input style={styles.input} placeholder="Stock" type="number" value={form.stock}
          onChange={e => setForm({ ...form, stock: e.target.value })} />
        <select style={styles.input} value={form.id_categoria}
          onChange={e => setForm({ ...form, id_categoria: e.target.value })}>
          <option value="">-- Categoría --</option>
          {categorias.map(c => <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>)}
        </select>
        <select style={styles.input} value={form.id_proveedor}
          onChange={e => setForm({ ...form, id_proveedor: e.target.value })}>
          <option value="">-- Proveedor --</option>
          {proveedores.map(p => <option key={p.id_proveedor} value={p.id_proveedor}>{p.nombre}</option>)}
        </select>
        <button style={styles.btn} onClick={handleSubmit}>{editId ? 'Actualizar' : 'Crear'}</button>
        {editId && <button style={styles.btnGris} onClick={() => { setEditId(null); setForm({ nombre: '', precio: '', stock: '', id_categoria: '', id_proveedor: '' }) }}>Cancelar</button>}
      </div>

      <table style={styles.tabla}>
        <thead>
          <tr>
            <th>ID</th><th>Nombre</th><th>Precio</th><th>Stock</th><th>Categoría</th><th>Proveedor</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(p => (
            <tr key={p.id_producto}>
              <td>{p.id_producto}</td>
              <td>{p.nombre}</td>
              <td>Q{p.precio}</td>
              <td>{p.stock}</td>
              <td>{p.categoria}</td>
              <td>{p.proveedor}</td>
              <td>
                <button style={styles.btnSm} onClick={() => handleEditar(p)}>Editar</button>
                <button style={styles.btnRojo} onClick={() => handleEliminar(p.id_producto)}>Eliminar</button>
              </td>
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