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
    setError(''); setMensaje('')
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
    setMensaje(editId ? 'Producto actualizado correctamente' : 'Producto creado correctamente')
    setForm({ nombre: '', precio: '', stock: '', id_categoria: '', id_proveedor: '' })
    setEditId(null)
    cargarProductos()
  }

  const handleEditar = (p) => {
    setEditId(p.id_producto)
    setForm({ nombre: p.nombre, precio: p.precio, stock: p.stock, id_categoria: p.id_categoria, id_proveedor: p.id_proveedor })
    setError(''); setMensaje('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return
    const res = await fetch(`${API}/productos/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (!res.ok) { setError(data.error); return }
    setMensaje('Producto eliminado')
    cargarProductos()
  }

  const cancelar = () => {
    setEditId(null)
    setForm({ nombre: '', precio: '', stock: '', id_categoria: '', id_proveedor: '' })
    setError(''); setMensaje('')
  }

  return (
    <div className="animate-in">
      <div className="page-header">
        <h1 className="page-title">Productos</h1>
        <p className="page-subtitle">Gestión de inventario y catálogo</p>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-value">{productos.length}</div>
          <div className="stat-label">Total productos</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{categorias.length}</div>
          <div className="stat-label">Categorías</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{productos.filter(p => p.stock < 10).length}</div>
          <div className="stat-label">Stock bajo</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{productos.reduce((s, p) => s + Number(p.stock), 0)}</div>
          <div className="stat-label">Unidades totales</div>
        </div>
      </div>

      {error && <div className="alert alert-error">⚠ {error}</div>}
      {mensaje && <div className="alert alert-success">✓ {mensaje}</div>}

      <div className="card">
        <div className="card-title">{editId ? '✏ Editar producto' : '＋ Nuevo producto'}</div>
        <div className="form-row">
          <input placeholder="Nombre del producto" value={form.nombre}
            onChange={e => setForm({ ...form, nombre: e.target.value })} />
          <input placeholder="Precio (Q)" type="number" value={form.precio}
            onChange={e => setForm({ ...form, precio: e.target.value })} style={{ maxWidth: 130 }} />
          <input placeholder="Stock" type="number" value={form.stock}
            onChange={e => setForm({ ...form, stock: e.target.value })} style={{ maxWidth: 110 }} />
          <select value={form.id_categoria}
            onChange={e => setForm({ ...form, id_categoria: e.target.value })}>
            <option value="">-- Categoría --</option>
            {categorias.map(c => <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>)}
          </select>
          <select value={form.id_proveedor}
            onChange={e => setForm({ ...form, id_proveedor: e.target.value })}>
            <option value="">-- Proveedor --</option>
            {proveedores.map(p => <option key={p.id_proveedor} value={p.id_proveedor}>{p.nombre}</option>)}
          </select>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {editId ? 'Actualizar' : 'Crear producto'}
          </button>
          {editId && (
            <button className="btn btn-ghost" onClick={cancelar}>Cancelar</button>
          )}
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="card-title" style={{ padding: '20px 24px 0' }}>Catálogo de productos (JOIN)</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Categoría</th>
                <th>Proveedor</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(p => (
                <tr key={p.id_producto}>
                  <td className="td-id">#{p.id_producto}</td>
                  <td style={{ fontWeight: 500 }}>{p.nombre}</td>
                  <td><span className="badge badge-purple">Q{Number(p.precio).toFixed(2)}</span></td>
                  <td>
                    <span className={`badge ${p.stock < 10 ? 'badge-red' : 'badge-orange'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{p.categoria}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{p.proveedor}</td>
                  <td>
                    <div className="td-actions">
                      <button className="btn btn-sm btn-edit" onClick={() => handleEditar(p)}>Editar</button>
                      <button className="btn btn-sm btn-delete" onClick={() => handleEliminar(p.id_producto)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}