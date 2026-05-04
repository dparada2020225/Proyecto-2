import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Productos from './pages/Productos'
import Clientes from './pages/Clientes'
import Ventas from './pages/Ventas'
import Reportes from './pages/Reportes'

export default function App() {
  return (
    <BrowserRouter>
      <nav>
        <div className="nav-brand">
          🛒 <span>Tienda</span>
        </div>
        <NavLink to="/" end>Productos</NavLink>
        <NavLink to="/clientes">Clientes</NavLink>
        <NavLink to="/ventas">Ventas</NavLink>
        <NavLink to="/reportes">Reportes</NavLink>
      </nav>
      <div className="page">
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