import { Link } from 'react-router-dom'
export default function Navbar() {
  return (
    <div className="navbar">
      <div className="brand"><Link to="/" style={{color:'inherit', textDecoration:'none'}}>RFP Manager</Link></div>
      <div>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </div>
  )
}
