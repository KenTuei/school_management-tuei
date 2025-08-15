import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../utils/api.js";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function StudentDetail() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [grades, setGrades] = useState([]);
  const [fees, setFees] = useState([]);

  useEffect(() => {
    api.get(`/api/students/${id}`).then((r) => setStudent(r.data));
    api.get(`/api/students/${id}/grades`).then((r) => setGrades(r.data));
    api.get(`/api/students/${id}/fees`).then((r) => setFees(r.data));
  }, [id]);

  const chartData = useMemo(() => {
    const groups = {};
    grades.forEach((g) => {
      const key = `${g.year} ${g.term}`;
      if (!groups[key]) groups[key] = { period: key, avg: 0, n: 0 };
      groups[key].avg += g.score;
      groups[key].n += 1;
    });
    return Object.values(groups).map((x) => ({
      period: x.period,
      average: +(x.avg / x.n).toFixed(1),
    }));
  }, [grades]);

  if (!student) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Basic Info */}
      <div className="bg-white shadow rounded p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Basic Info</h2>
          <p><span className="font-medium">Adm:</span> {student.admission_number}</p>
          <p><span className="font-medium">Name:</span> {student.first_name} {student.last_name}</p>
          <p><span className="font-medium">Gender:</span> {student.gender}</p>
          <p><span className="font-medium">Class:</span> {student.class_level}</p>
          <p><span className="font-medium">DOB:</span> {new Date(student.date_of_birth).toLocaleDateString()}</p>
        </div>

        {/* Fee Summary */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Fee Summary</h2>
          <div className="flex flex-wrap gap-4 mb-4">
            <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded">
              Total Due: KES {student.fee_summary.total_due.toLocaleString()}
            </span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded">
              Paid: KES {student.fee_summary.total_paid.toLocaleString()}
            </span>
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded">
              Balance: KES {student.fee_summary.balance.toLocaleString()}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["Term", "Year", "Due", "Paid", "Balance", "Status"].map((t) => (
                    <th key={t} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {fees.map((f) => (
                  <tr key={f.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{f.term}</td>
                    <td className="px-4 py-2">{f.year}</td>
                    <td className="px-4 py-2">{f.amount_due.toLocaleString()}</td>
                    <td className="px-4 py-2">{f.amount_paid.toLocaleString()}</td>
                    <td className="px-4 py-2">{f.balance.toLocaleString()}</td>
                    <td className="px-4 py-2">{f.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="bg-white shadow rounded p-6">
        <h2 className="text-lg font-semibold mb-2">Progress (Average per Term)</h2>
        <div className="w-full h-64">
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="average" stroke="#4f46e5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subjects */}
      <div className="bg-white shadow rounded p-6">
        <h2 className="text-lg font-semibold mb-2">Subjects</h2>
        <div className="flex flex-wrap gap-2">
          {student.subjects.map((sub) => (
            <span key={sub.id} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded">
              {sub.code} • {sub.name}
            </span>
          ))}
        </div>
      </div>

      {/* Parents */}
      <div className="bg-white shadow rounded p-6">
        <h2 className="text-lg font-semibold mb-2">Parents / Guardians</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Name", "Relationship", "Phone", "Email"].map((t) => (
                  <th key={t} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {student.parents.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{p.name}</td>
                  <td className="px-4 py-2">{p.relationship}</td>
                  <td className="px-4 py-2">{p.phone}</td>
                  <td className="px-4 py-2">{p.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <Link to="/students" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">
            Back to List
          </Link>
        </div>
      </div>
    </div>
  );
}
