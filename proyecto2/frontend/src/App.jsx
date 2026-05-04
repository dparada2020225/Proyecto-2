import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom'
import { useState, useEffect, createContext, useContext } from 'react'
import Productos from './pages/Productos'
import Clientes  from './pages/Clientes'
import Ventas    from './pages/Ventas'
import Reportes  from './pages/Reportes'
import Login     from './pages/Login'

const API = 'http://localhost:3001/api'

// ── Auth Context ──────────────────────────────────────────
export const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(undefined) // undefined = loading

  useEffect(() => {
    fetch(`${API}/auth/me`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => setUsuario(d.usuario || null))
      .catch(() => setUsuario(null))
  }, [])

  const login = (u) => setUsuario(u)
  const logout = async () => {
    await fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' })
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// ── Route guard ───────────────────────────────────────────
function ProtectedRoute({ children }) {
  const { usuario } = useAuth()
  if (usuario === undefined) return <div className="empty">Cargando...</div>
  if (!usuario) return <Navigate to="/login" replace />
  return children
}

// ── Main App ──────────────────────────────────────────────
export default function App() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved ? saved === 'dark' : true
  })

  useEffect(() => {
    document.documentElement.classList.toggle('light', !isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  return (
    <AuthProvider>
      <BrowserRouter>
        <AppShell isDark={isDark} toggleTheme={() => setIsDark(d => !d)} />
      </BrowserRouter>
    </AuthProvider>
  )
}

function AppShell({ isDark, toggleTheme }) {
  const { usuario, logout } = useAuth()

  return (
    <>
      {usuario && (
        <nav>
          <div className="nav-brand">🛒 <span>Tienda</span></div>
          <NavLink to="/" end>Productos</NavLink>
          <NavLink to="/clientes">Clientes</NavLink>
          <NavLink to="/ventas">Ventas</NavLink>
          <NavLink to="/reportes">Reportes</NavLink>

          <div className="nav-user">
            <span className="nav-username">👤 {usuario.nombre}</span>
            <button className="btn btn-ghost btn-sm" onClick={logout}>Cerrar sesión</button>
          </div>

          <button className="theme-toggle" onClick={toggleTheme}
            title={isDark ? 'Modo claro' : 'Modo oscuro'}>
            {isDark ? '☀️' : '🌙'}
          </button>
        </nav>
      )}

      <div className={usuario ? 'page' : ''}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/"          element={<ProtectedRoute><Productos /></ProtectedRoute>} />
          <Route path="/clientes"  element={<ProtectedRoute><Clientes  /></ProtectedRoute>} />
          <Route path="/ventas"    element={<ProtectedRoute><Ventas    /></ProtectedRoute>} />
          <Route path="/reportes"  element={<ProtectedRoute><Reportes  /></ProtectedRoute>} />
        </Routes>
      </div>
    </>
  )
}