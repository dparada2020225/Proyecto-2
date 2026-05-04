import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../App'

const API = 'http://localhost:3001/api'

export default function Login() {
  const [form, setForm]     = useState({ usuario: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const { login }           = useAuth()
  const navigate            = useNavigate()

  const handleSubmit = async (e) => {
    e?.preventDefault()
    setError('')
    if (!form.usuario || !form.password) {
      setError('Completa todos los campos')
      return
    }
    setLoading(true)
    try {
      const res  = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      login(data.usuario)
      navigate('/', { replace: true })
    } catch {
      setError('Error de conexión con el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.card} className="animate-in">
        {/* Logo / Brand */}
        <div style={styles.brand}>
          <span style={styles.brandIcon}>🛒</span>
          <div style={styles.brandText}>
            <span style={styles.brandName}>Tienda</span>
            <span style={styles.brandSub}>Sistema de Gestión</span>
          </div>
        </div>

        <h2 style={styles.title}>Iniciar sesión</h2>
        <p style={styles.subtitle}>Ingresa tus credenciales para continuar</p>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: 20 }}>
            ⚠ {error}
          </div>
        )}

        <div style={styles.field}>
          <label style={styles.label}>Usuario</label>
          <input
            style={styles.input}
            placeholder="admin"
            value={form.usuario}
            onChange={e => setForm({ ...form, usuario: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            autoFocus
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Contraseña</label>
          <input
            style={styles.input}
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
        </div>

        <button
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '11px', marginTop: 8 }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>

        <p style={styles.hint}>
          Usuario por defecto: <code style={styles.code}>admin</code> / <code style={styles.code}>admin123</code>
        </p>
      </div>
    </div>
  )
}

const styles = {
  wrap: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    background: 'var(--bg)',
  },
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 20,
    padding: '40px 36px',
    width: '100%',
    maxWidth: 400,
    boxShadow: 'var(--shadow)',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 32,
  },
  brandIcon: {
    fontSize: 36,
    lineHeight: 1,
  },
  brandText: {
    display: 'flex',
    flexDirection: 'column',
  },
  brandName: {
    fontFamily: 'var(--font-head)',
    fontSize: 22,
    fontWeight: 800,
    color: 'var(--text)',
    letterSpacing: '-0.5px',
    lineHeight: 1.1,
  },
  brandSub: {
    fontSize: 12,
    color: 'var(--text-muted)',
    marginTop: 2,
  },
  title: {
    fontFamily: 'var(--font-head)',
    fontSize: 22,
    fontWeight: 800,
    color: 'var(--text)',
    letterSpacing: '-0.5px',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13.5,
    color: 'var(--text-muted)',
    marginBottom: 28,
  },
  field: {
    marginBottom: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: 11.5,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    color: 'var(--text-muted)',
  },
  input: {
    width: '100%',
    minWidth: 'unset',
  },
  hint: {
    marginTop: 20,
    fontSize: 12,
    color: 'var(--text-dim)',
    textAlign: 'center',
  },
  code: {
    background: 'var(--surface2)',
    padding: '1px 6px',
    borderRadius: 4,
    fontFamily: 'monospace',
    fontSize: 12,
    color: 'var(--accent)',
  },
}