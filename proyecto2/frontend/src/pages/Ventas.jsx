import { useEffect, useState } from 'react'

const API = 'http://localhost:3001/api'

export default function Ventas() {
  const [ventas, setVentas] = useState([])
  const [clientes, setClientes] = useState([])
  const [empleados, setEmpleados] = useState([])
  const [productos, setProductos] = useState([])
  const [detalle, setDetalle] = useState([{ id_producto: '', cantidad: '', precio_unitario: '' }])
  const [form, setForm] = useState({ id_cliente: '', id_empleado: '' })
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [detalleVenta, setDetalleVenta] = useState(null)
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null)

  useEffect(() => {
    cargarVentas()
    fetch(`${API}/clientes`).then(r => r.json()).then(setClientes)
    fetch(`${API}/ventas/empleados`).then(r => r.json()).then(setEmpleados)
    fetch(`${API}/productos`).then(r => r.json()).then(setProductos)
  }, [])

  const cargarVentas = () => {
    fetch(`${API}/ventas`)
      .then(r => r.json())
      .then(setVentas)
      .catch(() => setError('Error al cargar ventas'))
  }

  const agregarLinea = () => {
    setDetalle([...detalle, { id_producto: '', cantidad: '', precio_unitario: '' }])
  }

  const eliminarLinea = (i) => {
    setDetalle(detalle.filter((_, idx) => idx !== i))
  }

  const handleDetalleChange = (i, campo, valor) => {
    const nuevo = [...detalle]
    nuevo[i][campo] = valor
    if (campo === 'id_producto') {
      const prod = productos.find(p => p.id_producto === parseInt(valor))
      if (prod) nuevo[i].precio_unitario = prod.precio
    }
    setDetalle(nuevo)
  }

  const handleSubmit = async () => {
    setError('')
    setMensaje('')
    if (!form.id_cliente || !form.id_empleado) {
      setError('Selecciona cliente y empleado')
      return
    }
    if (detalle.some(d => !d.id_producto || !d.cantidad)) {
      setError('Completa todos los productos del detalle')
      return
    }
    const res = await fetch(`${API}/ventas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, detalle })
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); return }
    setMensaje(`Venta #${data.id_venta} registrada correctamente`)
    setForm({ id_cliente: '', id_empleado: '' })
    setDetalle([{ id_producto: '', cantidad: '', precio_unitario: '' }])
    cargarVentas()
  }

  const verDetalle = async (id) => {
    setVentaSeleccionada(id)
    const res = await fetch(`${API}/ventas/${id}/detalle`)
    const data = await res.json()
    setDetalleVenta(data)
  }

  return (
    <div>
      <h2>Ventas</h2>

      {error && <div style={styles.error}>{error}</div>}
      {mensaje && <div style={styles.ok}>{mensaje}</div>}

      <div style={styles.form}>
        <h3>Nueva Venta</h3>
        <select style={styles.input} value={form.id_cliente}
          onChange={e => setForm({ ...form, id_cliente: e.target.value })}>
          <option value="">-- Cliente --</option>
          {clientes.map(c => <option key={c.id_cliente} value={c.id_cliente}>{c.nombre}</option>)}
        </select>
        <select style={styles.input} value={form.id_empleado}
          onChange={e => setForm({ ...form, id_empleado: e.target.value })}>
          <option value="">-- Empleado --</option>
          {empleados.map(e => <option key={e.id_empleado} value={e.id_empleado}>{e.nombre}</option>)}
        </select>

        <h4 style={{ width: '100%', margin: '8px 0 4px' }}>Detalle</h4>
        {detalle.map((d, i) => (
          <div key={i} style={styles.lineaDetalle}>
            <select style={styles.input} value={d.id_producto}
              onChange={e => handleDetalleChange(i, 'id_producto', e.target.value)}>
              <option value="">-- Producto --</option>
              {productos.map(p => <option key={p.id_producto} value={p.id_producto}>{p.nombre} (stock: {p.stock})</option>)}
            </select>
            <input style={styles.inputSm} placeholder="Cantidad" type="number" value={d.cantidad}
              onChange={e => handleDetalleChange(i, 'cantidad', e.target.value)} />
            <input style={styles.inputSm} placeholder="Precio unit." type="number" value={d.precio_unitario}
              onChange={e => handleDetalleChange(i, 'precio_unitario', e.target.value)} />
            {detalle.length > 1 &&
              <button style={styles.btnRojo} onClick={() => eliminarLinea(i)}>✕</button>}
          </div>
        ))}
        <button style={styles.btnGris} onClick={agregarLinea}>+ Agregar producto</button>
        <button style={styles.btn} onClick={handleSubmit}>Registrar Venta</button>
      </div>

      <h3>Ventas registradas (JOIN)</h3>
      <table style={styles.tabla}>
        <thead>
          <tr><th>ID</th><th>Fecha</th><th>Cliente</th><th>Empleado</th><th>Detalle</th></tr>
        </thead>
        <tbody>
          {ventas.map(v => (
            <tr key={v.id_venta}>
              <td>{v.id_venta}</td>
              <td>{new Date(v.fecha).toLocaleDateString()}</td>
              <td>{v.cliente}</td>
              <td>{v.empleado}</td>
              <td>
                <button style={styles.btnSm} onClick={() => verDetalle(v.id_venta)}>Ver</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {detalleVenta && (
        <div style={styles.modal}>
          <h3>Detalle de Venta #{ventaSeleccionada}</h3>
          <table style={styles.tabla}>
            <thead>
              <tr><th>Producto</th><th>Cantidad</th><th>Precio Unit.</th><th>Subtotal</th></tr>
            </thead>
            <tbody>
              {detalleVenta.map((d, i) => (
                <tr key={i}>
                  <td>{d.producto}</td>
                  <td>{d.cantidad}</td>
                  <td>Q{d.precio_unitario}</td>
                  <td>Q{d.subtotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button style={styles.btnGris} onClick={() => setDetalleVenta(null)}>Cerrar</button>
        </div>
      )}
    </div>
  )
}

const styles = {
  form: { background: '#f5f5f5', padding: '16px', borderRadius: '8px', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' },
  input: { padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' },
  inputSm: { padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px', width: '100px' },
  lineaDetalle: { display: 'flex', gap: '8px', alignItems: 'center', width: '100%' },
  btn: { padding: '8px 16px', background: '#1e1e2e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  btnGris: { padding: '8px 16px', background: '#888', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  btnSm: { padding: '4px 10px', background: '#4a90e2', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  btnRojo: { padding: '4px 8px', background: '#e25555', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  tabla: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
  error: { background: '#fdd', border: '1px solid #e25555', padding: '10px', borderRadius: '4px', marginBottom: '12px', color: '#c00' },
  ok: { background: '#dfd', border: '1px solid #4caf50', padding: '10px', borderRadius: '4px', marginBottom: '12px', color: '#2a7a2a' },
  modal: { marginTop: '24px', background: '#f0f0f0', padding: '16px', borderRadius: '8px' },
}