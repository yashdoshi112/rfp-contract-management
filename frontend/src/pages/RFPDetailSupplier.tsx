import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api, API } from '../api'
import StatusChip from '../components/StatusChip'

export default function RFPDetailSupplier() {
  const { id } = useParams()
  const [rfp, setRfp] = useState<any>(null)
  const [message, setMessage] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function load() {
    const r = await api(`/rfps/${id}`); setRfp(r);
  }
  useEffect(() => { load() }, [id])

  async function submitResponse(e:any) {
    e.preventDefault(); setSubmitting(true)
    const fd = new FormData()
    fd.append('message', message)
    if (file) fd.append('attachment', file)
    await fetch(`${API}/rfps/${id}/responses`, { method:'POST', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }, body: fd })
    setMessage(''); setFile(null); await load()
  }

  if (!rfp) return <div className="card">Loading...</div>

  return (
    <div className="card">
      <h2>{rfp.title}</h2>
      <p>{rfp.description}</p>
      <p><StatusChip status={rfp.status} /></p>
      {rfp.attachmentKey && <p><a href={rfp.attachmentKey} target="_blank">Download RFP attachment</a></p>}

      <h3>Submit your response</h3>
      <form onSubmit={submitResponse} className="row">
        <div style={{gridColumn:'1 / -1'}}>
          <label>Message</label>
          <textarea rows={4} value={message} onChange={e=>setMessage(e.target.value)}></textarea>
        </div>
        <div>
          <label>Attachment (optional)</label>
          <input type="file" onChange={e=>setFile(e.target.files?.[0] || null)} />
        </div>
        <div style={{display:'flex',alignItems:'end'}}>
          <button disabled={submitting}>{submitting ? 'Submitting...' : 'Submit response'}</button>
        </div>
      </form>
    </div>
  )
}
