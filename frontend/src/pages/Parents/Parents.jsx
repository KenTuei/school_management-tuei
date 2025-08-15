import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api.js";

export default function Parents() {
  const [parents, setParents] = useState([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    api.get("/api/parents").then((res) => setParents(res.data));
  }, []);

  const filtered = parents.filter(
    (p) =>
      p.name.toLowerCase().includes(q.toLowerCase()) ||
      p.phone.toLowerCase().includes(q.toLowerCase()) ||
      p.email.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Parents / Guardians</h1>
        <div className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, phone, or email..."
            className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Link
            to="/parents/add"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded"
          >
            + Add Parent
          </Link>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500">No parents found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <div key={p.id} className="bg-white shadow rounded p-4 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">{p.name}</h3>
                <p className="text-gray-500 mb-1">Relationship: {p.relationship}</p>
                <p className="text-gray-500 mb-1">Phone: {p.phone}</p>
                <p className="text-gray-500 mb-1">Email: {p.email}</p>
              </div>
              <div className="flex gap-2 mt-2">
                <Link
                  to={`/parents/edit/${p.id}`}
                  className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
