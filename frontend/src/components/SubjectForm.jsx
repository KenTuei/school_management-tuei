import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api.js";

export default function SubjectForm({ editMode = false }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [subject, setSubject] = useState({
    code: "",
    name: "",
  });

  useEffect(() => {
    if (editMode) {
      api.get(`/api/subjects/${id}`).then((res) => setSubject(res.data));
    }
  }, [editMode, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubject((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      api.put(`/api/subjects/${id}`, subject).then(() => navigate("/subjects"));
    } else {
      api.post("/api/subjects", subject).then(() => navigate("/subjects"));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-6">{editMode ? "Edit Subject" : "Add Subject"}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="code"
            placeholder="Subject Code"
            value={subject.code}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            name="name"
            placeholder="Subject Name"
            value={subject.name}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded mt-2"
          >
            {editMode ? "Update Subject" : "Add Subject"}
          </button>
        </form>
      </div>
    </div>
  );
}
