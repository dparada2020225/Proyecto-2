import { useEffect, useState } from 'react'

const API = 'http://localhost:3001/api'

export default function Reportes() {
  const [ventasTotales, setVentasTotales] = useState([])
  const [cteVentas, setCteVentas] = useState([])
  const [clientesFrecuentes, setClientesFrecuentes] = useState([])
  const [bajoStock, setBajoStock] = useState([])

  useEffect(() => {
    fetch(`${API}/reportes/ventas-totales`).then(r => r.json()).then(setVentasTotales)
    fetch(`${API}/reportes/cte-ventas`).then(r => r.json()).then(setCteVentas)
    fetch(`${API}/reportes/clientes-frecuentes`).then(r => r.json()).then(setClientesFrecuentes)
    fetch(`${API}/productos/bajo-stock`).then(r => r.json()).then(setBajoStock)
  }, [])

  return (
    <div>
      <h2>Reportes</h2>

      <div style={styles.seccion}>
        <h3>Total por Venta (VIEW: reporte_ventas)</h3>
        <table style={styles.tabla}>
          <thead>
            <tr><th>ID Venta</th><th>Total</th></tr>
          </thead>
          <tbody>
            {ventasTotales.map(v => (
              <tr key={v.id_venta}>
                <td>{v.id_venta}</td>
                <td>Q{parseFloat(v.total).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={styles.seccion}>
        <h3>Ventas por Cliente (CTE - WITH)</h3>
        <table style={styles.tabla}>
          <thead>
            <tr><th>ID Venta</th><th>Cliente</th><th>Total</th></tr>
          </thead>
          <tbody>
            {cteVentas.map(v => (
              <tr key={v.id_venta}>
                <td>{v.id_venta}</td>
                <td>{v.cliente}</td>
                <td>Q{parseFloat(v.total).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={styles.seccion}>
        <h3>Clientes Frecuentes (GROUP BY + HAVING)</h3>
        <table style={styles.tabla}>
          <thead>
            <tr><th>Cliente</th><th>Total Ventas</th></tr>
          </thead>
          <tbody>
            {clientesFrecuentes.map((c, i) => (
              <tr key={i}>
                <td>{c.nombre}</td>
                <td>{c.total_ventas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={styles.seccion}>
        <h3>Productos con Bajo Stock (Subquery)</h3>
        <table style={styles.tabla}>
          <thead>
            <tr><th>Producto</th><th>Stock</th></tr>
          </thead>
          <tbody>
            {bajoStock.map((p, i) => (
              <tr key={i}>
                <td>{p.nombre}</td>
                <td style={{ color: p.stock < 10 ? '#e25555' : '#333' }}>{p.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const styles = {
  seccion: {
    marginBottom: '36px',
    background: '#f9f9f9',
    padding: '16px',
    borderRadius: '8px',
    borderLeft: '4px solid #1e1e2e'
  },
  tabla: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px'
  }
}