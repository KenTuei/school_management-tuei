import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api.js";

export default function ParentForm({ editMode = false }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [parent, setParent] = useState({
    name: "",
    relationship: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    if (editMode) {
      api.get(`/api/parents/${id}`).then((res) => setParent(res.data));
    }
  }, [editMode, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      api.put(`/api/parents/${id}`, parent).then(() => navigate("/parents"));
    } else {
      api.post("/api/parents", parent).then(() => navigate("/parents"));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">{editMode ? "Edit Parent" : "Add Parent"}</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={parent.name}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="text"
          name="relationship"
          placeholder="Relationship"
          value={parent.relationship}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={parent.phone}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={parent.email}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded mt-2"
        >
          {editMode ? "Update Parent" : "Add Parent"}
        </button>
      </form>
    </div>
  );
}
