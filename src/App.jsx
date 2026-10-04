import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import RoleSelection from "./pages/RoleSelection";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";

function ProtectedRoute({ role, children }) {
  const token = localStorage.getItem("token");
  const currentRole = localStorage.getItem("role");

  if (!token) return <Navigate to="/" replace />;
  if (role && currentRole !== role) {
    return <Navigate to={currentRole === "teacher" ? "/teacher" : "/student"} replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoleSelection />} />
        <Route path="/login" element={<RoleSelection mode="login" />} />
        <Route path="/signup" element={<RoleSelection mode="signup" />} />

        <Route path="/teacher/login" element={<Login role="teacher" />} />
        <Route path="/student/login" element={<Login role="student" />} />
        <Route path="/teacher/signup" element={<Signup role="teacher" />} />
        <Route path="/student/signup" element={<Signup role="student" />} />

        <Route path="/teacher" element={
          <ProtectedRoute role="teacher"><TeacherDashboard /></ProtectedRoute>
        } />
        <Route path="/student" element={
          <ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
