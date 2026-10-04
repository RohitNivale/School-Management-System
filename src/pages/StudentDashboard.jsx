import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Bell, CalendarCheck, GraduationCap, LogOut, Award, TrendingUp, UserRound } from "lucide-react";

const API = import.meta.env.VITE_API_URL ;

export default function StudentDashboard() {
  const token = localStorage.getItem("token");
  const studentId = localStorage.getItem("userId");
  const name = localStorage.getItem("name");
  const headers = { Authorization: `Bearer ${token}` };

  const [attendance, setAttendance] = useState([]);
  const [results, setResults] = useState([]);
  const [progress, setProgress] = useState(null);
  const [notices, setNotices] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [a, r, p, n] = await Promise.all([
        axios.get(`${API}/attendance/student/${studentId}`, { headers }),
        axios.get(`${API}/results/student/${studentId}`, { headers }),
        axios.get(`${API}/progress/student/${studentId}`, { headers }),
        axios.get(`${API}/notices`, { headers })
      ]);
      setAttendance(a.data);
      setResults(r.data);
      setProgress(p.data);
      setNotices(n.data);
    } catch (e) {
      setError(e.response?.data?.message || "Could not load dashboard.");
    }
  };

  useEffect(() => { load(); }, []);

  const present = attendance.filter(a => a.status === "Present").length;
  const absent = attendance.length - present;
  const attendancePercent = attendance.length ? (present / attendance.length) * 100 : 0;

  const averageMarks = useMemo(() => {
    if (!results.length) return 0;
    return results.reduce((sum, r) => sum + Number(r.marks), 0) / results.length;
  }, [results]);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-slate-950 text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-xl"><GraduationCap /></div>
            <div><h1 className="font-bold text-lg">School Portal</h1><p className="text-xs text-slate-400">Student Panel</p></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right"><p className="font-semibold">{name}</p><p className="text-xs text-slate-400">Student</p></div>
            <button onClick={logout} className="flex gap-2 items-center bg-red-500 hover:bg-red-600 px-3 py-2 rounded-xl"><LogOut size={17}/> Logout</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-7">
          <p className="text-blue-600 font-semibold">Student Dashboard</p>
          <h2 className="text-3xl font-black text-slate-900 mt-1">Welcome, {name} 👋</h2>
          <p className="text-slate-500 mt-2">View your attendance, results, notices and progress.</p>
        </div>

        {error && <div className="mb-5 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">{error}</div>}

        <div className="grid sm:grid-cols-3 gap-5 mb-7">
          <Stat icon={CalendarCheck} title="Attendance" value={`${attendancePercent.toFixed(1)}%`} />
          <Stat icon={Award} title="Average Marks" value={`${averageMarks.toFixed(1)}%`} />
          <Stat icon={Bell} title="Notices" value={notices.length} />
        </div>

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7 mb-6">
          <div className="flex items-center gap-3 mb-5"><Bell className="text-orange-500"/><h3 className="text-xl font-bold">📢 Latest Notices</h3></div>
          <div className="space-y-3">
            {notices.map((n, i) => <Notice key={n._id} notice={n} isNew={i === 0}/>)}
            {!notices.length && <p className="text-slate-500">No notices available.</p>}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7 mb-6">
          <div className="flex items-center gap-3 mb-5"><CalendarCheck className="text-green-600"/><h3 className="text-xl font-bold">My Attendance</h3></div>
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <Metric label="Present" value={present} cls="bg-green-50 text-green-700"/>
            <Metric label="Absent" value={absent} cls="bg-red-50 text-red-700"/>
            <Metric label="Percentage" value={`${attendancePercent.toFixed(1)}%`} cls="bg-blue-50 text-blue-700"/>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-slate-200"><th className="p-3">Date</th><th className="p-3">Status</th></tr></thead>
              <tbody>
                {attendance.map(a => <tr key={a._id} className="border-b border-slate-100">
                  <td className="p-3">{new Date(a.date).toLocaleDateString()}</td>
                  <td className="p-3"><span className={`px-3 py-1 rounded-full text-sm font-semibold ${a.status === "Present" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{a.status}</span></td>
                </tr>)}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7 mb-6">
          <div className="flex items-center gap-3 mb-5"><Award className="text-yellow-500"/><h3 className="text-xl font-bold">📊 My Results</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-slate-200"><th className="p-3">Subject</th><th className="p-3">Exam</th><th className="p-3">Marks</th></tr></thead>
              <tbody>
                {results.map(r => <tr key={r._id} className="border-b border-slate-100">
                  <td className="p-3 font-semibold">{r.subject}</td><td className="p-3">{r.exam}</td><td className="p-3 font-bold text-blue-600">{r.marks}/100</td>
                </tr>)}
              </tbody>
            </table>
          </div>
        </section>

        {progress && <section>
          <div className="flex items-center gap-3 mb-5"><TrendingUp className="text-blue-600"/><h3 className="text-xl font-bold">📈 My Progress</h3></div>
          <div className="grid md:grid-cols-2 gap-6">
            <ProgressCard title="📅 Weekly Progress" data={progress.weekly}/>
            <ProgressCard title="📆 Monthly Progress" data={progress.monthly}/>
          </div>
        </section>}
      </main>
    </div>
  );
}

function Stat({ icon: Icon, title, value }) {
  return <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex justify-between items-center">
    <div><p className="text-sm text-slate-500">{title}</p><p className="text-3xl font-black mt-1">{value}</p></div>
    <div className="p-3 rounded-xl bg-slate-100"><Icon className="text-blue-600"/></div>
  </div>;
}

function Metric({ label, value, cls }) {
  return <div className={`${cls} rounded-xl p-5`}><p>{label}</p><p className="text-3xl font-black mt-1">{value}</p></div>;
}

function ProgressCard({ title, data }) {
  return <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
    <h4 className="text-lg font-bold mb-6">{title}</h4>
    <Progress label="Attendance" value={data.attendance} />
    <Progress label="Academic Performance" value={data.academic} />
    <p className="text-xs text-slate-400 mt-4">{data.records} attendance records in this period.</p>
  </div>;
}

function Progress({ label, value }) {
  return <div className="mb-5">
    <div className="flex justify-between text-sm font-semibold mb-2"><span>{label}</span><span>{value}%</span></div>
    <div className="h-3 rounded-full bg-slate-200 overflow-hidden"><div className="h-full bg-blue-600 rounded-full" style={{width: `${Math.min(100, Math.max(0, value))}%`}}/></div>
  </div>;
}

function Notice({ notice, isNew }) {
  return <div className={`p-5 rounded-xl border ${isNew ? "bg-orange-50 border-orange-200" : "border-slate-200"}`}>
    {isNew && <span className="inline-block bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-2">🔴 NEW</span>}
    <h4 className="font-bold text-lg">{notice.title}</h4>
    <p className="text-slate-600 mt-1">{notice.description}</p>
    <p className="text-xs text-slate-400 mt-3">Posted {new Date(notice.createdAt).toLocaleString()}</p>
  </div>;
}