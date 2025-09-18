import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api'
import StatusChip from '../components/StatusChip'

export default function RFPDetailBuyer() {
  const { id } = useParams()
  const [rfp, setRfp] = useState<any>(null)
  const [responses, setResponses] = useState<any[]>([])

  async function load() {
    const r = await api(`/rfps/${id}`); setRfp(r)
    const rr = await api(`/rfps/${id}/responses`); setResponses(rr)
  }
  useEffect(() => { load() }, [id])

  async function setUnderReview() { await api(`/rfps/${id}/under-review`, { method:'POST' }); await load() }
  async function approve(responseId?: string) { await api(`/rfps/${id}/approve`, { method:'POST', body: JSON.stringify({ responseId }) }); await load() }
  async function reject() { await api(`/rfps/${id}/reject`, { method:'POST' }); await load() }

  if (!rfp) return <div className="card">Loading...</div>

  return (
    <div className="card">
      <h2>{rfp.title}</h2>
      <p>{rfp.description}</p>
      <p><StatusChip status={rfp.status} /></p>
      {rfp.attachmentKey && <p><a href={rfp.attachmentKey} target="_blank">Download RFP attachment</a></p>}
      <div style={{display:'flex', gap:8}}>
        <button onClick={setUnderReview}>Mark Under Review</button>
        <button className="ghost" onClick={reject}>Reject</button>
      </div>

      <h3 style={{marginTop:24}}>Responses</h3>
      <div className="list">
        {responses.map(r => (
          <div className="item" key={r.id}>
            <div style={{flex:1}}>
              <h4>{r.supplier.name} • {r.supplier.email}</h4>
              <p style={{margin:'6px 0 0'}}>{r.message}</p>
              {r.attachmentKey && <p style={{margin:0}}><a href={r.attachmentKey} target="_blank">Download response</a></p>}
            </div>
            <div style={{display:'flex', gap:8}}>
              <button onClick={()=>approve(r.id)}>Approve</button>
              <button className="ghost" onClick={()=>{ /* could set per-response reject here */ }}>—</button>
            </div>
          </div>
        ))}
        {!responses.length && <p>No responses yet.</p>}
      </div>
    </div>
  )
}
