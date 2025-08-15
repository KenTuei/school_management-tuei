import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";

// Students
import Students from "./pages/Students/Students.jsx";
import StudentDetail from "./pages/Students/StudentDetail.jsx";

// Parents
import Parents from "./pages/Parents/Parents.jsx";

// Subjects
import Subjects from "./pages/Subjects/Subjects.jsx";

// Components (Forms & PrivateRoute)
import StudentForm from "./components/StudentForm.jsx";
import ParentForm from "./components/ParentForm.jsx";
import SubjectForm from "./components/SubjectForm.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import GlobalModal from "./components/GlobalModal.jsx"; // <-- import it here

// Auth context
import { useAuth } from "./context/AuthContext.jsx";

function App() {
  const { user } = useAuth();

  return (
    <>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Students */}
        <Route
          path="/students"
          element={
            <PrivateRoute>
              <Students />
            </PrivateRoute>
          }
        />
        <Route
          path="/students/add"
          element={
            <PrivateRoute>
              <StudentForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/students/edit/:id"
          element={
            <PrivateRoute>
              <StudentForm editMode={true} />
            </PrivateRoute>
          }
        />
        <Route
          path="/students/:id"
          element={
            <PrivateRoute>
              <StudentDetail />
            </PrivateRoute>
          }
        />

        {/* Parents */}
        <Route
          path="/parents"
          element={
            <PrivateRoute>
              <Parents />
            </PrivateRoute>
          }
        />
        <Route
          path="/parents/add"
          element={
            <PrivateRoute>
              <ParentForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/parents/edit/:id"
          element={
            <PrivateRoute>
              <ParentForm editMode={true} />
            </PrivateRoute>
          }
        />

        {/* Subjects */}
        <Route
          path="/subjects"
          element={
            <PrivateRoute>
              <Subjects />
            </PrivateRoute>
          }
        />
        <Route
          path="/subjects/add"
          element={
            <PrivateRoute>
              <SubjectForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/subjects/edit/:id"
          element={
            <PrivateRoute>
              <SubjectForm editMode={true} />
            </PrivateRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>

      {/* Global inactivity modal */}
      {user && <GlobalModal />}
    </>
  );
}

export default App;
