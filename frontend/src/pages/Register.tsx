import { useState } from 'react'
import { api } from '../api'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('BUYER')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  async function onSubmit(e:any) {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      await api('/auth/register', { method:'POST', body: JSON.stringify({ email, password, name, role }) })
      navigate('/login')
    } catch (err:any) { setError(err.message) } finally { setLoading(false) }
  }

  return (
    <div className="card" style={{maxWidth:520, margin:'40px auto'}}>
      <h2>Create account</h2>
      <form onSubmit={onSubmit}>
        <label>Name</label>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" />
        <label>Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />
        <label>Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Min 6 chars" />
        <div className="row">
          <div>
            <label>Role</label>
            <select value={role} onChange={e=>setRole(e.target.value)}>
              <option value="BUYER">Buyer</option>
              <option value="SUPPLIER">Supplier</option>
            </select>
          </div>
        </div>
        {error && <p style={{color:'#ff9b9b'}}>{error}</p>}
        <button disabled={loading}>{loading ? 'Creating...' : 'Register'}</button>
      </form>
    </div>
  )
}
