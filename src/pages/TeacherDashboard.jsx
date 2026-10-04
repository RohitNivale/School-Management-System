import { useEffect, useState } from "react";
import axios from "axios";
import {
  Bell, BookOpen, CalendarCheck, FileText, GraduationCap,
  LayoutDashboard, LogOut, PlusCircle, Users, X
} from "lucide-react";
import { API_URL } from "../api";

export default function TeacherDashboard() {
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const headers = { Authorization: `Bearer ${token}` };

  const [students, setStudents] = useState([]);
  const [notices, setNotices] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState("Present");
  const [result, setResult] = useState({ subject: "", marks: "", exam: "" });
  const [notice, setNotice] = useState({ title: "", description: "" });
  const [tab, setTab] = useState("attendance");
  const [toast, setToast] = useState("");

  const notify = msg => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const load = async () => {
    try {
      const [s, n] = await Promise.all([
        axios.get(`${API_URL}/attendance/students`, { headers }),
        axios.get(`${API_URL}/notices`, { headers })
      ]);
      setStudents(s.data);
      setNotices(n.data);
    } catch (e) {
      notify(e.response?.data?.message || "Could not load data.");
    }
  };

  useEffect(() => { load(); }, []);

  const markAttendance = async () => {
    if (!selectedStudent) return notify("Select a student first.");
    try {
      await axios.post(`${API_URL}/attendance/mark`, {
        studentId: selectedStudent, date: new Date(), status: attendanceStatus
      }, { headers });
      notify("Attendance saved successfully.");
    } catch (e) { notify(e.response?.data?.message || "Attendance failed."); }
  };

  const addResult = async () => {
    if (!selectedStudent || !result.subject || result.marks === "" || !result.exam) {
      return notify("Complete all result fields.");
    }
    try {
      await axios.post(`${API_URL}/results/add`, {
        studentId: selectedStudent, subject: result.subject,
        marks: Number(result.marks), exam: result.exam
      }, { headers });
      setResult({ subject: "", marks: "", exam: "" });
      notify("Result saved successfully.");
    } catch (e) { notify(e.response?.data?.message || "Result failed."); }
  };

  const addNotice = async () => {
    if (!notice.title || !notice.description) return notify("Complete all notice fields.");
    try {
      await axios.post(`${API_URL}/notices/add`, notice, { headers });
      setNotice({ title: "", description: "" });
      await load();
      notify("New notice published.");
    } catch (e) { notify(e.response?.data?.message || "Notice failed."); }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const tabs = [
    ["attendance", "Attendance", CalendarCheck],
    ["result", "Results", FileText],
    ["notice", "Notices", Bell]
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-slate-950 text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-xl"><GraduationCap /></div>
            <div><h1 className="font-bold text-lg">School Portal</h1><p className="text-xs text-slate-400">Teacher Panel</p></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right"><p className="font-semibold">{name}</p><p className="text-xs text-slate-400">Teacher</p></div>
            <button onClick={logout} className="flex gap-2 items-center bg-red-500 hover:bg-red-600 px-3 py-2 rounded-xl"><LogOut size={17}/> Logout</button>
          </div>
        </div>
      </header>

      {toast && <div className="fixed right-5 top-20 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl flex gap-3 items-center">{toast}<button onClick={() => setToast("")}><X size={16}/></button></div>}

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-7">
          <p className="text-blue-600 font-semibold">Teacher Dashboard</p>
          <h2 className="text-3xl font-black text-slate-900 mt-1">Welcome, {name} 👋</h2>
          <p className="text-slate-500 mt-2">Manage attendance, results and school notices.</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-5 mb-7">
          <Stat icon={Users} title="Total Students" value={students.length} />
          <Stat icon={CalendarCheck} title="Attendance" value="Manage" />
          <Stat icon={Bell} title="Published Notices" value={notices.length} />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-6 overflow-x-auto">
          <div className="flex min-w-max">
            {tabs.map(([key, label, Icon]) => (
              <button key={key} onClick={() => setTab(key)}
                className={`px-6 py-4 flex gap-2 items-center font-semibold border-b-2 ${tab === key ? "text-blue-600 border-blue-600" : "text-slate-500 border-transparent"}`}>
                <Icon size={18}/>{label}
              </button>
            ))}
          </div>
        </div>

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7">
          <div className="flex items-center gap-3 mb-6">
            {tab === "attendance" && <CalendarCheck className="text-blue-600"/>}
            {tab === "result" && <FileText className="text-blue-600"/>}
            {tab === "notice" && <Bell className="text-orange-500"/>}
            <h3 className="text-xl font-bold text-slate-900">
              {tab === "attendance" ? "Mark Attendance" : tab === "result" ? "Enter Result" : "Publish Notice"}
            </h3>
          </div>

          {tab === "attendance" && <Attendance students={students} selectedStudent={selectedStudent} setSelectedStudent={setSelectedStudent} status={attendanceStatus} setStatus={setAttendanceStatus} save={markAttendance}/>}
          {tab === "result" && <ResultForm students={students} selectedStudent={selectedStudent} setSelectedStudent={setSelectedStudent} result={result} setResult={setResult} save={addResult}/>}
          {tab === "notice" && <NoticeForm notice={notice} setNotice={setNotice} save={addNotice}/>}
        </section>

        <section className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7">
          <div className="flex items-center gap-3 mb-5"><Bell className="text-orange-500"/><h3 className="text-xl font-bold">Notice Board</h3></div>
          <div className="space-y-3">
            {notices.map((n, i) => <NoticeCard key={n._id} notice={n} isNew={i === 0}/>)}
            {!notices.length && <p className="text-slate-500">No notices yet.</p>}
          </div>
        </section>
      </main>
    </div>
  );
}

function Stat({ icon: Icon, title, value }) {
  return <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
    <div className="flex justify-between items-center">
      <div><p className="text-sm text-slate-500">{title}</p><p className="text-3xl font-black mt-1">{value}</p></div>
      <div className="p-3 rounded-xl bg-slate-100"><Icon className="text-blue-600"/></div>
    </div>
  </div>;
}

function SelectStudent({ students, selectedStudent, setSelectedStudent }) {
  return <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)}
    className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500">
    <option value="">Select Student</option>
    {students.map(s => <option key={s._id} value={s._id}>{s.name} — Roll No. {s.rollNo ?? "-"}</option>)}
  </select>;
}

function Attendance({ students, selectedStudent, setSelectedStudent, status, setStatus, save }) {
  return <div className="grid md:grid-cols-3 gap-4">
    <SelectStudent {...{students, selectedStudent, setSelectedStudent}}/>
    <select value={status} onChange={e => setStatus(e.target.value)} className="border border-slate-300 rounded-xl px-4 py-3">
      <option>Present</option><option>Absent</option>
    </select>
    <button onClick={save} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold px-5 py-3">Save Attendance</button>
  </div>;
}

function ResultForm({ students, selectedStudent, setSelectedStudent, result, setResult, save }) {
  return <div>
    <div className="grid md:grid-cols-2 gap-4">
      <SelectStudent {...{students, selectedStudent, setSelectedStudent}}/>
      <input className="input" placeholder="Subject" value={result.subject} onChange={e => setResult({...result, subject: e.target.value})}/>
      <input className="input" type="number" min="0" max="100" placeholder="Marks (0-100)" value={result.marks} onChange={e => setResult({...result, marks: e.target.value})}/>
      <input className="input" placeholder="Exam Name" value={result.exam} onChange={e => setResult({...result, exam: e.target.value})}/>
    </div>
    <button onClick={save} className="mt-5 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold px-5 py-3"><PlusCircle size={18}/> Save Result</button>
  </div>;
}

function NoticeForm({ notice, setNotice, save }) {
  return <div className="max-w-2xl space-y-4">
    <input className="input" placeholder="Notice Title" value={notice.title} onChange={e => setNotice({...notice, title: e.target.value})}/>
    <textarea className="input min-h-32 resize-none" placeholder="Notice Description" value={notice.description} onChange={e => setNotice({...notice, description: e.target.value})}/>
    <button onClick={save} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold px-5 py-3"><Bell size={18}/> Publish Notice</button>
  </div>;
}

function NoticeCard({ notice, isNew }) {
  return <div className={`p-5 rounded-xl border ${isNew ? "bg-orange-50 border-orange-200" : "border-slate-200"}`}>
    {isNew && <span className="inline-block bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-2">🔴 NEW</span>}
    <h4 className="font-bold text-lg">{notice.title}</h4>
    <p className="text-slate-600 mt-1">{notice.description}</p>
    <p className="text-xs text-slate-400 mt-3">Posted {new Date(notice.createdAt).toLocaleString()}</p>
  </div>;
}