import { useState } from 'react'
import { api } from '../api'
import { setToken, setUser } from '../auth'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('buyer@test.com')
  const [password, setPassword] = useState('password123')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  async function onSubmit(e:any) {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      const data = await api('/auth/login', { method:'POST', body: JSON.stringify({ email, password }) })
      setToken(data.token); setUser(data.user)
      navigate('/')
    } catch (err:any) { setError(err.message) } finally { setLoading(false) }
  }

  return (
    <div className="card" style={{maxWidth:480, margin:'40px auto'}}>
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <label>Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />
        <label>Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" />
        {error && <p style={{color:'#ff9b9b'}}>{error}</p>}
        <button disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
      </form>
      <p style={{color:'#9fb0d9'}}>Try: buyer@test.com or supplier@test.com (password123)</p>
    </div>
  )
}
