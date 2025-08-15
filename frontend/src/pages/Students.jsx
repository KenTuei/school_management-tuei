import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'

export default function Students(){
  const [students, setStudents] = useState([])
  const [q, setQ] = useState('')

  useEffect(() => {
    axios.get(`${API}/api/students`).then(r => setStudents(r.data))
  }, [])

  const filtered = students.filter(s => 
    `${s.first_name} ${s.last_name}`.toLowerCase().includes(q.toLowerCase()) || 
    s.admission_number.toLowerCase().includes(q.toLowerCase())
  )

  return (
    <div>
      <div className="header">Students</div>
      <div style={{marginBottom:12, display:'flex', gap:8}}>
        <input value={q} onChange={e=>setQ(e.target.value)} className="input" placeholder="Search by name or admission number..." />
      </div>
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Adm No</th><th>Name</th><th>Gender</th><th>Class</th><th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id}>
                <td>{s.admission_number}</td>
                <td>{s.first_name} {s.last_name}</td>
                <td>{s.gender}</td>
                <td>{s.class_level}</td>
                <td><Link className="pill" to={`/students/${s.id}`}>View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
