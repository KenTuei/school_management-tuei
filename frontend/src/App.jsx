import React, { useEffect, useState } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Students from './pages/Students.jsx'
import StudentDetail from './pages/StudentDetail.jsx'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'

function Nav() {
  return (
    <div className="card" style={{marginBottom:16, display:'flex', alignItems:'center', gap:16}}>
      <Link to="/" className="pill">Dashboard</Link>
      <Link to="/students" className="pill">Students</Link>
      <a href={`${API}/api/dev/seed`} onClick={(e)=>e.preventDefault()} className="pill" title="Use POST /api/dev/seed from a REST client">Seed (via API)</a>
    </div>
  )
}

function Dashboard() {
  const [summary, setSummary] = useState(null)
  useEffect(() => {
    axios.get(`${API}/api/summary`).then(r => setSummary(r.data)).catch(()=>{})
  }, [])
  return (
    <div>
      <div className="header">School Dashboard</div>
      <div className="grid">
        <div className="card" style={{gridColumn:'span 3'}}>
          <div className="sub">Students</div>
          <div className="stat">{summary?.students ?? '—'}</div>
        </div>
        <div className="card" style={{gridColumn:'span 3'}}>
          <div className="sub">Subjects</div>
          <div className="stat">{summary?.subjects ?? '—'}</div>
        </div>
        <div className="card" style={{gridColumn:'span 3'}}>
          <div className="sub">Total Due</div>
          <div className="stat">KES {summary?.total_due?.toLocaleString() ?? '—'}</div>
        </div>
        <div className="card" style={{gridColumn:'span 3'}}>
          <div className="sub">Total Paid</div>
          <div className="stat">KES {summary?.total_paid?.toLocaleString() ?? '—'}</div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <div className="container">
      <Nav />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/students/:id" element={<StudentDetail />} />
      </Routes>
    </div>
  )
}
