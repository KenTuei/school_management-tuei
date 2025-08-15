import React from "react";
import { Link } from "react-router-dom";

const StudentCard = ({ student }) => {
  return (
    <div className="bg-white shadow rounded p-4 flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold mb-1">{student.name}</h3>
        <p className="text-gray-500 mb-2">Class: {student.grade}</p>
      </div>
      <div className="flex gap-2 mt-2">
        <Link
          to={`/students/${student.id}`}
          className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded text-sm"
        >
          View
        </Link>
        <Link
          to={`/students/edit/${student.id}`}
          className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm"
        >
          Edit
        </Link>
      </div>
    </div>
  );
};

export default StudentCard;
