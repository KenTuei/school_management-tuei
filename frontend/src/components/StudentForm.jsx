import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar.jsx';

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

export default function StudentForm({ editMode = false }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState({
    first_name: '',
    last_name: '',
    admission_number: '',
    gender: 'Male',
    class_level: '',
    date_of_birth: ''
  });

  useEffect(() => {
    if (editMode && id) {
      axios.get(`${API}/api/students/${id}`)
        .then(r => setStudent(r.data))
        .catch(err => console.error(err));
    }
  }, [editMode, id]);

  const handleChange = e => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (editMode) {
      axios.put(`${API}/api/students/${id}`, student)
        .then(() => navigate('/students'))
        .catch(err => console.error(err));
    } else {
      axios.post(`${API}/api/students`, student)
        .then(() => navigate('/students'))
        .catch(err => console.error(err));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-6">{editMode ? 'Edit Student' : 'Add Student'}</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="first_name"
            placeholder="First Name"
            value={student.first_name}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            name="last_name"
            placeholder="Last Name"
            value={student.last_name}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            name="admission_number"
            placeholder="Admission Number"
            value={student.admission_number}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <select
            name="gender"
            value={student.gender}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option>Male</option>
            <option>Female</option>
          </select>

          <input
            name="class_level"
            placeholder="Class Level"
            value={student.class_level}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="date"
            name="date_of_birth"
            value={student.date_of_birth}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded mt-2"
          >
            {editMode ? 'Update' : 'Add'} Student
          </button>
        </form>
      </div>
    </div>
  );
}
