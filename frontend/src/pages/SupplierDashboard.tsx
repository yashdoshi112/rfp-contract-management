import { useEffect, useState } from 'react'
import { api } from '../api'
import StatusChip from '../components/StatusChip'
import { Link } from 'react-router-dom'
import { io } from 'socket.io-client'

export default function SupplierDashboard() {
  const [rfps, setRfps] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  async function load(q = '') {
    setLoading(true)
    const data = await api(`/rfps?search=${encodeURIComponent(q)}`)
    setRfps(data); setLoading(false)
  }
  useEffect(() => { load() }, [])

  useEffect(() => {
    const socket = io(location.origin.replace('5173','4000'))
    socket.on('rfpUpdated', () => load(search))
    return () => socket.disconnect()
  }, [search])

  return (
    <div>
      <div className="card" style={{marginBottom:16}}>
        <h2>Browse RFPs</h2>
        <div className="row">
          <div style={{gridColumn:'1 / -1'}}>
            <input placeholder="Search by title or description..." value={search} onChange={e=>{ setSearch(e.target.value); load(e.target.value) }} />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="list">
          {loading ? <p>Loading...</p> : rfps.map(r => (
            <div key={r.id} className="item">
              <div>
                <h4 style={{marginBottom:6}}><Link to={`/supplier/rfp/${r.id}`} style={{color:'#e8eefc'}}>{r.title}</Link></h4>
                <div><StatusChip status={r.status} /></div>
              </div>
              <div><small>Due: {r.dueDate ? new Date(r.dueDate).toLocaleDateString() : '—'}</small></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
