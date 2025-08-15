import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      {/* Left side links */}
      <div className="flex space-x-4">
        <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600 font-medium">Dashboard</Link>
        <Link to="/students" className="text-gray-700 hover:text-indigo-600 font-medium">Students</Link>
        <Link to="/parents" className="text-gray-700 hover:text-indigo-600 font-medium">Parents</Link>
        <Link to="/subjects" className="text-gray-700 hover:text-indigo-600 font-medium">Subjects</Link>
      </div>

      {/* Right side user info */}
      <div className="flex items-center space-x-4">
        {user && <span className="text-gray-700 font-medium">Hi, {user.name}</span>}
        <button
          onClick={logout}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md text-sm"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
