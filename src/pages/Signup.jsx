import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { UserRound, Mail, Lock, BookOpen, Hash, ArrowLeft } from "lucide-react";
import { AuthShell } from "./Login";
import { API_URL } from "../api";

export default function Signup({ role }) {
  const navigate = useNavigate();
  const label = role === "teacher" ? "Teacher" : "Student";
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    className: "", rollNo: "", subject: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async e => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (form.password !== form.confirmPassword) return setError("Passwords do not match.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");

    setLoading(true);
    try {
      await axios.post(`${API_URL}/auth/register`, {
        name: form.name.trim(), email: form.email.trim().toLowerCase(),
        password: form.password, role,
        ...(role === "teacher"
          ? { subject: form.subject.trim() }
          : { className: form.className.trim(), rollNo: Number(form.rollNo) })
      });
      setSuccess("Account created successfully. Redirecting to login...");
      setTimeout(() => navigate(`/${role}/login`), 900);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create account.");
    } finally {
      setLoading(false);
    }
  };

  const update = (key, value) => setForm({ ...form, [key]: value });

  return (
    <AuthShell title={`${label} Sign Up`} subtitle={`Create your ${label.toLowerCase()} account`}>
      <form onSubmit={submit} className="space-y-4">
        {error && <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-red-700 text-sm">{error}</div>}
        {success && <div className="rounded-xl bg-green-50 border border-green-200 p-3 text-green-700 text-sm">{success}</div>}

        <Field icon={UserRound} label="Full Name" placeholder="Enter full name" value={form.name} onChange={e => update("name", e.target.value)} />
        <Field icon={Mail} label="Email" type="email" placeholder="Enter email" value={form.email} onChange={e => update("email", e.target.value)} />

        {role === "teacher" ? (
          <Field icon={BookOpen} label="Subject" placeholder="e.g. Computer Science" value={form.subject} onChange={e => update("subject", e.target.value)} />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Field icon={BookOpen} label="Class" placeholder="10-A" value={form.className} onChange={e => update("className", e.target.value)} />
            <Field icon={Hash} label="Roll No." type="number" min="1" placeholder="1" value={form.rollNo} onChange={e => update("rollNo", e.target.value)} />
          </div>
        )}

        <Field icon={Lock} label="Password" type="password" minLength="6" placeholder="Minimum 6 characters" value={form.password} onChange={e => update("password", e.target.value)} />
        <Field icon={Lock} label="Confirm Password" type="password" minLength="6" placeholder="Re-enter password" value={form.confirmPassword} onChange={e => update("confirmPassword", e.target.value)} />

        <button disabled={loading} className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold">
          {loading ? "Creating account..." : `Create ${label} Account`}
        </button>

        <p className="text-center text-sm text-slate-500">
          Already have an account? <Link className="text-blue-600 font-bold" to={`/${role}/login`}>Login</Link>
        </p>
        <Link to="/signup" className="flex justify-center items-center gap-2 text-sm text-slate-500 hover:text-blue-600">
          <ArrowLeft size={16}/> Choose another portal
        </Link>
      </form>
    </AuthShell>
  );
}

function Field({ icon: Icon, label, ...props }) {
  return <div>
    <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
    <div className="relative">
      <Icon className="absolute left-3 top-3.5 text-slate-400" size={18}/>
      <input {...props} required className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500"/>
    </div>
  </div>;
}
