import { GraduationCap, School, UserRound, LogIn, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RoleSelection({ mode = "login" }) {
  const navigate = useNavigate();
  const title = mode === "signup" ? "Create Your Account" : "School Management System";
  const subtitle = mode === "signup"
    ? "Choose your portal to create an account"
    : "Choose your portal to continue";

  const go = role => navigate(`/${role}/${mode}`);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center text-white mb-10">
          <div className="inline-flex p-4 rounded-2xl bg-blue-600 shadow-lg mb-4">
            <GraduationCap size={42} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black">{title}</h1>
          <p className="text-slate-300 mt-2">{subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <RoleCard
            role="teacher"
            icon={School}
            title="Teacher Portal"
            description={mode === "signup" ? "Create a teacher account" : "Login to manage your classes"}
            button={mode === "signup" ? "Teacher Sign Up" : "Teacher Login"}
            onClick={() => go("teacher")}
          />
          <RoleCard
            role="student"
            icon={UserRound}
            title="Student Portal"
            description={mode === "signup" ? "Create a student account" : "Login to view your academic details"}
            button={mode === "signup" ? "Student Sign Up" : "Student Login"}
            onClick={() => go("student")}
          />
        </div>

        <div className="text-center mt-8">
          {mode === "login" ? (
            <button onClick={() => navigate("/signup")} className="text-white font-semibold hover:text-blue-200 inline-flex items-center gap-2">
              <UserPlus size={18} /> Don't have an account? Sign up
            </button>
          ) : (
            <button onClick={() => navigate("/login")} className="text-white font-semibold hover:text-blue-200 inline-flex items-center gap-2">
              <LogIn size={18} /> Already have an account? Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function RoleCard({ icon: Icon, title, description, button, onClick }) {
  return (
    <div className="bg-white rounded-3xl p-7 shadow-2xl border border-white/20 hover:-translate-y-1 transition">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
        <Icon size={34} />
      </div>
      <h2 className="text-2xl font-black text-slate-900">{title}</h2>
      <p className="text-slate-500 mt-2 mb-7">{description}</p>
      <button onClick={onClick} className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition">
        {button}
      </button>
    </div>
  );
}
