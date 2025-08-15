import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import api from "../utils/api.js";

const AdminLandingDashboard = () => {
  const [landing, setLanding] = useState({
    mission: "",
    vision: "",
    headTeacher: { name: "", message: "", image: "" },
  });
  const [topStudents, setTopStudents] = useState([]);
  const [gallery, setGallery] = useState([]);

  const [mission, setMission] = useState("");
  const [vision, setVision] = useState("");
  const [headMessage, setHeadMessage] = useState("");
  const [headImage, setHeadImage] = useState(null);

  const [newStudent, setNewStudent] = useState({ name: "", grade: "", score: "", image: null });
  const [editStudentId, setEditStudentId] = useState(null);
  const [newGalleryImage, setNewGalleryImage] = useState(null);

  const [confirmDelete, setConfirmDelete] = useState({ show: false, type: "", id: null });

  // Fetch data
  useEffect(() => {
    const fetchLandingData = async () => {
      const resLanding = await api.get("/api/landing");
      setLanding(resLanding.data);
      setMission(resLanding.data.mission);
      setVision(resLanding.data.vision);
      setHeadMessage(resLanding.data.headTeacher.message);

      const resStudents = await api.get("/api/students");
      setTopStudents(resStudents.data);

      const resGallery = await api.get("/api/gallery");
      setGallery(resGallery.data);
    };
    fetchLandingData();
  }, []);

  // Update Landing
  const handleLandingUpdate = async () => {
    const formData = new FormData();
    formData.append("mission", mission);
    formData.append("vision", vision);
    formData.append("headMessage", headMessage);
    if (headImage) formData.append("headImage", headImage);

    await api.put("/api/landing", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    alert("Landing content updated!");
  };

  // Add or Edit Student
  const handleSaveStudent = async () => {
    const formData = new FormData();
    formData.append("name", newStudent.name);
    formData.append("grade", newStudent.grade);
    formData.append("score", newStudent.score);
    if (newStudent.image) formData.append("image", newStudent.image);

    if (editStudentId) {
      const res = await api.put(`/api/students/${editStudentId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setTopStudents(topStudents.map((s) => (s._id === editStudentId ? res.data : s)));
      setEditStudentId(null);
    } else {
      const res = await api.post("/api/students", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setTopStudents([...topStudents, res.data]);
    }
    setNewStudent({ name: "", grade: "", score: "", image: null });
  };

  // Delete Student
  const handleDeleteStudent = async (id) => {
    await api.delete(`/api/students/${id}`);
    setTopStudents(topStudents.filter((s) => s._id !== id));
    setConfirmDelete({ show: false, type: "", id: null });
  };

  // Delete Gallery Image
  const handleDeleteGallery = async (id) => {
    await api.delete(`/api/gallery/${id}`);
    setGallery(gallery.filter((g) => g._id !== id));
    setConfirmDelete({ show: false, type: "", id: null });
  };

  // Add Gallery Image
  const handleAddGallery = async () => {
    if (!newGalleryImage) return;
    const formData = new FormData();
    formData.append("image", newGalleryImage);

    const res = await api.post("/api/gallery", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setGallery([...gallery, res.data]);
    setNewGalleryImage(null);
  };

  // Start editing student
  const startEditStudent = (student) => {
    setEditStudentId(student._id);
    setNewStudent({
      name: student.name,
      grade: student.grade,
      score: student.score,
      image: null,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold">Admin Landing Page Dashboard</h1>

        {/* Mission & Vision */}
        <section className="bg-white p-6 rounded shadow space-y-4">
          <h2 className="font-semibold text-lg">Mission & Vision</h2>
          <textarea
            className="w-full p-2 border rounded"
            value={mission}
            onChange={(e) => setMission(e.target.value)}
            placeholder="Mission"
          />
          <textarea
            className="w-full p-2 border rounded"
            value={vision}
            onChange={(e) => setVision(e.target.value)}
            placeholder="Vision"
          />
        </section>

        {/* Head Teacher */}
        <section className="bg-white p-6 rounded shadow space-y-4">
          <h2 className="font-semibold text-lg">Head Teacher Message</h2>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={landing.headTeacher.name}
            readOnly
          />
          <textarea
            className="w-full p-2 border rounded"
            value={headMessage}
            onChange={(e) => setHeadMessage(e.target.value)}
            placeholder="Message"
          />
          <input
            type="file"
            onChange={(e) => setHeadImage(e.target.files[0])}
            className="border rounded p-2"
          />
        </section>

        <button
          onClick={handleLandingUpdate}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Update Landing Content
        </button>

        {/* Top Students */}
        <section className="bg-white p-6 rounded shadow space-y-4">
          <h2 className="font-semibold text-lg">Top Students</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topStudents.map((s) => (
              <div key={s._id} className="border p-2 rounded relative">
                <img src={s.image} alt={s.name} className="w-24 h-24 rounded-full mx-auto mb-2" />
                <p>{s.name}</p>
                <p>Grade: {s.grade}</p>
                <p>Score: {s.score}</p>
                <div className="flex justify-between mt-2">
                  <button
                    onClick={() => startEditStudent(s)}
                    className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setConfirmDelete({ show: true, type: "student", id: s._id })}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 mt-4">
            <input
              type="text"
              placeholder="Name"
              value={newStudent.name}
              onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Grade"
              value={newStudent.grade}
              onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Score"
              value={newStudent.score}
              onChange={(e) => setNewStudent({ ...newStudent, score: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <input
              type="file"
              onChange={(e) => setNewStudent({ ...newStudent, image: e.target.files[0] })}
              className="w-full p-2 border rounded"
            />
            <button
              onClick={handleSaveStudent}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {editStudentId ? "Update Student" : "Add Student"}
            </button>
          </div>
        </section>

        {/* Gallery */}
        <section className="bg-white p-6 rounded shadow space-y-4">
          <h2 className="font-semibold text-lg">Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.map((g) => (
              <div key={g._id} className="relative">
                <img src={g.url} className="rounded shadow" />
                <button
                  onClick={() => setConfirmDelete({ show: true, type: "gallery", id: g._id })}
                  className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  X
                </button>
              </div>
            ))}
          </div>
          <input
            type="file"
            onChange={(e) => setNewGalleryImage(e.target.files[0])}
            className="w-full p-2 border rounded"
          />
          <button
            onClick={handleAddGallery}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Gallery Image
          </button>
        </section>

        {/* Confirmation Modal */}
        {confirmDelete.show && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow space-y-4 max-w-sm w-full text-center">
              <p>Are you sure you want to delete this {confirmDelete.type}?</p>
              <div className="flex justify-around">
                <button
                  onClick={() => {
                    if (confirmDelete.type === "student") handleDeleteStudent(confirmDelete.id);
                    else handleDeleteGallery(confirmDelete.id);
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setConfirmDelete({ show: false, type: "", id: null })}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLandingDashboard;
