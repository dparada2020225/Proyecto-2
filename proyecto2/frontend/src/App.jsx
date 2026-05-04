import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Productos from './pages/Productos'
import Clientes from './pages/Clientes'
import Ventas from './pages/Ventas'
import Reportes from './pages/Reportes'

export default function App() {
  const [isDark, setIsDark] = useState(() => {
    // Recordar preferencia del usuario
    const saved = localStorage.getItem('theme')
    return saved ? saved === 'dark' : true // dark por defecto
  })

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.remove('light')
    } else {
      document.documentElement.classList.add('light')
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

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

        <button
          className="theme-toggle"
          onClick={() => setIsDark(!isDark)}
          title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
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