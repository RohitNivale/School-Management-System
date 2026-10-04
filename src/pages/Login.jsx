import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Mail, Lock, ArrowLeft } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Login({ role }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const label = role === "teacher" ? "Teacher" : "Student";

  const submit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/auth/login`, { ...form, role });
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("role", data.role);
      localStorage.setItem("name", data.name);
      navigate(role === "teacher" ? "/teacher" : "/student");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title={`${label} Login`} subtitle={`Login to your ${label.toLowerCase()} portal`}>
      <form onSubmit={submit} className="space-y-5">
        {error && <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-red-700 text-sm">{error}</div>}
        <Field icon={Mail} label="Email" type="email" placeholder={`${label} email`} value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })} />
        <Field icon={Lock} label="Password" type="password" placeholder="Enter password" value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })} />
        <button disabled={loading} className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold">
          {loading ? "Logging in..." : `Login as ${label}`}
        </button>
        <p className="text-center text-sm text-slate-500">
          Don't have a {label.toLowerCase()} account?{" "}
          <Link className="text-blue-600 font-bold" to={`/${role}/signup`}>Sign up</Link>
        </p>
        <Link to="/login" className="flex justify-center items-center gap-2 text-sm text-slate-500 hover:text-blue-600">
          <ArrowLeft size={16}/> Choose another portal
        </Link>
      </form>
    </AuthShell>
  );
}

function Field({ icon: Icon, label, ...props }) {
  return <div>
    <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
    <div className="relative">
      <Icon className="absolute left-3 top-3.5 text-slate-400" size={19}/>
      <input {...props} required className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500"/>
    </div>
  </div>;
}

export function AuthShell({ title, subtitle, children }) {
  return <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-900 to-slate-800 flex items-center justify-center p-4">
    <div className="w-full max-w-md">
      <div className="text-center text-white mb-7">
        <div className="inline-flex p-4 rounded-2xl bg-blue-600 shadow-lg mb-4"><GraduationCap size={38}/></div>
        <h1 className="text-3xl font-black">School Portal</h1>
        <p className="text-slate-300 mt-2">{subtitle}</p>
      </div>
      <div className="bg-white rounded-3xl p-7 shadow-2xl">
        <h2 className="text-2xl font-black text-slate-900 mb-6">{title}</h2>
        {children}
      </div>
    </div>
  </div>;
}
