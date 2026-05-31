import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom'
import { useState, useEffect, createContext, useContext } from 'react'
import Productos from './pages/Productos'
import Clientes  from './pages/Clientes'
import Ventas    from './pages/Ventas'
import Reportes  from './pages/Reportes'
import Login     from './pages/Login'
import { puedeVer } from './permisos'

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

// ── Route guard: requiere login ───────────────────────────
function ProtectedRoute({ children }) {
  const { usuario } = useAuth()
  if (usuario === undefined) return <div className="empty">Cargando...</div>
  if (!usuario) return <Navigate to="/login" replace />
  return children
}

// ── Route guard: requiere login + permiso de sección ─────
function RoleRoute({ seccion, children }) {
  const { usuario } = useAuth()
  if (usuario === undefined) return <div className="empty">Cargando...</div>
  if (!usuario) return <Navigate to="/login" replace />
  if (!puedeVer(usuario.rol, seccion)) {
    return (
      <div className="empty" style={{ textAlign: 'center', paddingTop: 80 }}>
        <div style={{ fontSize: 48 }}>🔒</div>
        <h2 style={{ marginTop: 16 }}>Acceso denegado</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Tu rol <strong>{usuario.rol}</strong> no tiene permiso para ver esta sección.
        </p>
      </div>
    )
  }
  return children
}

// ── Badge de rol ──────────────────────────────────────────
const ROL_COLORS = {
  rol_admin:    'badge-red',
  rol_gerente:  'badge-purple',
  rol_vendedor: 'badge-orange',
  rol_cajero:   'badge-blue',
  rol_consulta: 'badge-green',
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
  const rol = usuario?.rol

  return (
    <>
      {usuario && (
        <nav>
          <div className="nav-brand">🛒 <span>Tienda</span></div>

          {puedeVer(rol, 'productos') && <NavLink to="/" end>Productos</NavLink>}
          {puedeVer(rol, 'clientes')  && <NavLink to="/clientes">Clientes</NavLink>}
          {puedeVer(rol, 'ventas')    && <NavLink to="/ventas">Ventas</NavLink>}
          {puedeVer(rol, 'reportes')  && <NavLink to="/reportes">Reportes</NavLink>}

          <div className="nav-user">
            <span className={`badge ${ROL_COLORS[rol] || 'badge-purple'}`} style={{ fontSize: 11 }}>
              {rol}
            </span>
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
          <Route path="/"         element={<RoleRoute seccion="productos"><Productos /></RoleRoute>} />
          <Route path="/clientes" element={<RoleRoute seccion="clientes"><Clientes /></RoleRoute>} />
          <Route path="/ventas"   element={<RoleRoute seccion="ventas"><Ventas /></RoleRoute>} />
          <Route path="/reportes" element={<RoleRoute seccion="reportes"><Reportes /></RoleRoute>} />
        </Routes>
      </div>
    </>
  )
}
