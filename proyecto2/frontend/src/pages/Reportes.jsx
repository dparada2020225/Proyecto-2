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

  const totalGeneral = ventasTotales.reduce((s, v) => s + Number(v.total), 0)

  return (
    <div className="animate-in">
      <div className="page-header">
        <h1 className="page-title">Reportes</h1>
        <p className="page-subtitle">Análisis de ventas e inventario</p>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-value">{ventasTotales.length}</div>
          <div className="stat-label">Ventas totales</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">Q{totalGeneral.toFixed(0)}</div>
          <div className="stat-label">Ingresos totales</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{clientesFrecuentes.length}</div>
          <div className="stat-label">Clientes frecuentes</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{bajoStock.filter(p => p.stock < 10).length}</div>
          <div className="stat-label">Productos críticos</div>
        </div>
      </div>

      {/* VIEW */}
      <div className="report-section">
        <div className="report-section-header">
          <div className="report-section-title">Total por Venta</div>
          <span className="report-section-tag">VIEW</span>
          <code style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-dim)', fontFamily: 'monospace' }}>reporte_ventas</code>
        </div>
        <div className="report-section-body">
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>ID Venta</th><th>Total</th></tr>
              </thead>
              <tbody>
                {ventasTotales.map(v => (
                  <tr key={v.id_venta}>
                    <td className="td-id">#{v.id_venta}</td>
                    <td><span className="badge badge-purple">Q{Number(v.total).toFixed(2)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CTE */}
      <div className="report-section">
        <div className="report-section-header">
          <div className="report-section-title">Ventas por Cliente</div>
          <span className="report-section-tag">CTE — WITH</span>
        </div>
        <div className="report-section-body">
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>ID Venta</th><th>Cliente</th><th>Total</th></tr>
              </thead>
              <tbody>
                {cteVentas.map(v => (
                  <tr key={v.id_venta}>
                    <td className="td-id">#{v.id_venta}</td>
                    <td style={{ fontWeight: 500 }}>{v.cliente}</td>
                    <td><span className="badge badge-orange">Q{Number(v.total).toFixed(2)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* GROUP BY + HAVING */}
      <div className="report-section">
        <div className="report-section-header">
          <div className="report-section-title">Clientes Frecuentes</div>
          <span className="report-section-tag">GROUP BY + HAVING</span>
        </div>
        <div className="report-section-body">
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Cliente</th><th>Total Ventas</th></tr>
              </thead>
              <tbody>
                {clientesFrecuentes.map((c, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500 }}>{c.nombre}</td>
                    <td>
                      <span className="badge badge-purple">{c.total_ventas} ventas</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SUBQUERY */}
      <div className="report-section">
        <div className="report-section-header">
          <div className="report-section-title">Productos con Bajo Stock</div>
          <span className="report-section-tag">Subquery</span>
          <code style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-dim)', fontFamily: 'monospace' }}>stock &lt; AVG(stock)</code>
        </div>
        <div className="report-section-body">
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Producto</th><th>Stock</th></tr>
              </thead>
              <tbody>
                {bajoStock.map((p, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500 }}>{p.nombre}</td>
                    <td>
                      <span className={`badge ${p.stock < 10 ? 'badge-red' : 'badge-orange'}`}>
                        {p.stock}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}