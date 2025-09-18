import { useEffect, useState } from 'react'
import { api, API } from '../api'
import StatusChip from '../components/StatusChip'
import { Link } from 'react-router-dom'

export default function BuyerDashboard() {
  const [rfps, setRfps] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    const data = await api('/rfps/mine')
    setRfps(data); setLoading(false)
  }
  useEffect(() => { load() }, [])

  async function create(e:any) {
    e.preventDefault(); setError(null)
    const fd = new FormData()
    fd.append('title', title)
    fd.append('description', description)
    if (dueDate) fd.append('dueDate', dueDate)
    if (file) fd.append('attachment', file)
    try {
      await fetch(`${API}/rfps`, { method: 'POST', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }, body: fd })
      setTitle(''); setDescription(''); setDueDate(''); setFile(null); await load()
    } catch (err:any) { setError(err.message) }
  }

  async function publish(id:string) {
    await api(`/rfps/${id}/publish`, { method:'POST' }); await load();
  }

  return (
    <div>
      <div className="card" style={{marginBottom:16}}>
        <h2>Create RFP</h2>
        <form onSubmit={create} className="row">
          <div>
            <label>Title</label>
            <input value={title} onChange={e=>setTitle(e.target.value)} />
          </div>
          <div>
            <label>Due Date</label>
            <input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} />
          </div>
          <div style={{gridColumn:'1 / -1'}}>
            <label>Description</label>
            <textarea rows={4} value={description} onChange={e=>setDescription(e.target.value)}></textarea>
          </div>
          <div>
            <label>Attachment (optional)</label>
            <input type="file" onChange={e=>setFile(e.target.files?.[0] || null)} />
          </div>
          <div style={{display:'flex',alignItems:'end'}}>
            <button>Create</button>
          </div>
        </form>
        {error && <p style={{color:'#ff9b9b'}}>{error}</p>}
      </div>

      <div className="card">
        <h2>My RFPs</h2>
        {loading ? <p>Loading...</p> : (
          <div className="list">
            {rfps.map(r => (
              <div key={r.id} className="item">
                <div>
                  <h4 style={{marginBottom:6}}><Link to={`/buyer/rfp/${r.id}`} style={{color:'#e8eefc'}}>{r.title}</Link></h4>
                  <div><StatusChip status={r.status} /></div>
                </div>
                <div>
                  {r.status === 'DRAFT' && <button onClick={()=>publish(r.id)}>Publish</button>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
