import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api.js";
import StudentCard from "../../components/StudentCard.jsx";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/api/students")
      .then((res) => setStudents(res.data))
      .catch((err) => setError("Failed to load students"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = students.filter(
    (s) =>
      `${s.first_name} ${s.last_name}`.toLowerCase().includes(q.toLowerCase()) ||
      s.admission_number.toLowerCase().includes(q.toLowerCase())
  );

  if (loading) return <p className="p-6 text-gray-500">Loading students...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Students</h1>
        <div className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name or admission number..."
            className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Link
            to="/students/add"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded"
          >
            + Add Student
          </Link>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500">No students found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((s) => (
            <StudentCard
              key={s.id}
              student={{
                id: s.id,
                name: `${s.first_name} ${s.last_name}`,
                grade: s.class_level,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
