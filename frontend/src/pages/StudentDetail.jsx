import React, { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'

export default function StudentDetail(){
  const { id } = useParams()
  const [student, setStudent] = useState(null)
  const [grades, setGrades] = useState([])
  const [fees, setFees] = useState([])

  useEffect(() => {
    axios.get(`${API}/api/students/${id}`).then(r => setStudent(r.data))
    axios.get(`${API}/api/students/${id}/grades`).then(r => setGrades(r.data))
    axios.get(`${API}/api/students/${id}/fees`).then(r => setFees(r.data))
  }, [id])

  const chartData = useMemo(() => {
    // aggregate per term-year average
    const groups = {}
    grades.forEach(g => {
      const key = `${g.year} ${g.term}`
      if(!groups[key]) groups[key] = { period: key, avg: 0, n: 0 }
      groups[key].avg += g.score; groups[key].n += 1
    })
    return Object.values(groups).map(x => ({ period: x.period, average: +(x.avg / x.n).toFixed(1) }))
  }, [grades])

  if(!student) return <div>Loading...</div>

  return (
    <div>
      <div className="header">Student Profile</div>
      <div className="grid">
        <div className="card" style={{gridColumn:'span 5'}}>
          <div className="sub">Basic Info</div>
          <div><b>Adm:</b> {student.admission_number}</div>
          <div><b>Name:</b> {student.first_name} {student.last_name}</div>
          <div><b>Gender:</b> {student.gender}</div>
          <div><b>Class:</b> {student.class_level}</div>
          <div><b>DOB:</b> {new Date(student.date_of_birth).toLocaleDateString()}</div>
        </div>
        <div className="card" style={{gridColumn:'span 7'}}>
          <div className="sub">Fee Summary</div>
          <div style={{display:'flex', gap:16}}>
            <div className="pill">Total Due: KES {student.fee_summary.total_due.toLocaleString()}</div>
            <div className="pill">Paid: KES {student.fee_summary.total_paid.toLocaleString()}</div>
            <div className="pill">Balance: KES {student.fee_summary.balance.toLocaleString()}</div>
          </div>
          <div style={{marginTop:12}}>
            <table className="table">
              <thead><tr><th>Term</th><th>Year</th><th>Due</th><th>Paid</th><th>Balance</th><th>Status</th></tr></thead>
              <tbody>
                {fees.map(f => (
                  <tr key={f.id}>
                    <td>{f.term}</td><td>{f.year}</td>
                    <td>{f.amount_due.toLocaleString()}</td>
                    <td>{f.amount_paid.toLocaleString()}</td>
                    <td>{f.balance.toLocaleString()}</td>
                    <td>{f.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card" style={{gridColumn:'span 12'}}>
          <div className="sub" style={{marginBottom:8}}>Progress (Average per Term)</div>
          <div style={{width:'100%', height:300}}>
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis domain={[0,100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="average" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{gridColumn:'span 12'}}>
          <div className="sub">Subjects</div>
          <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
            {student.subjects.map(sub => (
              <span key={sub.id} className="pill">{sub.code} • {sub.name}</span>
            ))}
          </div>
        </div>

        <div className="card" style={{gridColumn:'span 12'}}>
          <div className="sub">Parents / Guardians</div>
          <table className="table">
            <thead><tr><th>Name</th><th>Relationship</th><th>Phone</th><th>Email</th></tr></thead>
            <tbody>
              {student.parents.map(p => (
                <tr key={p.id}>
                  <td>{p.name}</td><td>{p.relationship}</td><td>{p.phone}</td><td>{p.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{marginTop:8}}>
            <Link className="pill" to="/students">Back to list</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
