export default function StatusChip({status}:{status:string}) {
  return <span className={`status ${status}`}>{status}</span>
}
