import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import BuyerDashboard from './pages/BuyerDashboard'
import SupplierDashboard from './pages/SupplierDashboard'
import RFPDetailBuyer from './pages/RFPDetailBuyer'
import RFPDetailSupplier from './pages/RFPDetailSupplier'
import { getUser, logout } from './auth'

function PrivateRoute({ children, roles }: { children: JSX.Element, roles?: string[] }) {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const user = getUser();
  const navigate = useNavigate();

  return (
    <div>
      <div className="navbar">
        <div className="brand"><Link to="/" style={{color:'inherit', textDecoration:'none'}}>RFP Manager</Link></div>
        <div>
          {user ? (
            <>
              <span style={{marginRight:12, color:'#9fb0d9'}}>{user.name} • {user.role}</span>
              <button className="ghost" onClick={() => { logout(); navigate('/login'); }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>

      <div className="container">
        <Routes>
          <Route path="/" element={
            user ? (user.role === 'BUYER' ? <Navigate to="/buyer" /> : <Navigate to="/supplier" />) : <Navigate to="/login" />
          }/>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/buyer" element={<PrivateRoute roles={['BUYER']}><BuyerDashboard /></PrivateRoute>} />
          <Route path="/supplier" element={<PrivateRoute roles={['SUPPLIER']}><SupplierDashboard /></PrivateRoute>} />
          <Route path="/buyer/rfp/:id" element={<PrivateRoute roles={['BUYER']}><RFPDetailBuyer /></PrivateRoute>} />
          <Route path="/supplier/rfp/:id" element={<PrivateRoute roles={['SUPPLIER']}><RFPDetailSupplier /></PrivateRoute>} />
        </Routes>
      </div>
    </div>
  )
}
