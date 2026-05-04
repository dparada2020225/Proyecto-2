import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Productos from './pages/Productos'
import Clientes from './pages/Clientes'
import Ventas from './pages/Ventas'
import Reportes from './pages/Reportes'

export default function App() {
  return (
    <BrowserRouter>
      <nav style={styles.nav}>
        <span style={styles.brand}>🛒 Tienda</span>
        <Link style={styles.link} to="/">Productos</Link>
        <Link style={styles.link} to="/clientes">Clientes</Link>
        <Link style={styles.link} to="/ventas">Ventas</Link>
        <Link style={styles.link} to="/reportes">Reportes</Link>
      </nav>
      <div style={styles.container}>
        <Routes>
          <Route path="/" element={<Productos />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/reportes" element={<Reportes />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

const styles = {
  nav: {
    background: '#1e1e2e',
    padding: '12px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  brand: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '20px',
    marginRight: 'auto',
  },
  link: {
    color: '#cdd6f4',
    textDecoration: 'none',
    fontSize: '15px',
  },
  container: {
    padding: '24px',
    fontFamily: 'sans-serif',
  }
}