import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api.js";

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    api.get("/api/subjects").then((res) => setSubjects(res.data));
  }, []);

  const filtered = subjects.filter(
    (s) =>
      s.name.toLowerCase().includes(q.toLowerCase()) ||
      s.code.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div>
      <div className="header">Subjects</div>
      <div style={{ marginBottom: 12, display: "flex", gap: 8 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="input"
          placeholder="Search by code or name..."
        />
        <Link className="pill" to="/subjects/add">
          + Add Subject
        </Link>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id}>
                <td>{s.code}</td>
                <td>{s.name}</td>
                <td>
                  <Link className="pill" to={`/subjects/edit/${s.id}`}>Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
