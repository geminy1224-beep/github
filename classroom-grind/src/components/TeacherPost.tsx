import React, { useState } from "react";
import { useClassroom } from "../context/ClassroomContext";
import { 
  Plus, 
  Check, 
  ListChecks, 
  BookOpen, 
  Trash2 
} from "lucide-react";

export const TeacherPost: React.FC = () => {
  const { 
    tasks, 
    addTask, 
    deleteTask,
    setActiveTab
  } = useClassroom();
  
  const [subject, setSubject] = useState("Physics");
  const [chapter, setChapter] = useState("Organic Chemistry");
  const [title, setTitle] = useState("Solve Aldehydes and Ketones reaction sheets");
  const [expectedMinutes, setExpectedMinutes] = useState(45);
  const [justAddedAlarm, setJustAddedAlarm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chapter.trim() || !title.trim()) return;
    
    addTask(subject, chapter, title, expectedMinutes);
    setJustAddedAlarm(true);
    setTimeout(() => {
      setJustAddedAlarm(false);
      setActiveTab("dashboard"); // automatically redirect student to Tuition Desk so they can start the task
    }, 1200);
  };

  const getTeacherPersona = (sub: string) => {
    switch (sub) {
      case "Mathematics": return { name: "Maths Miss", avatar: "📐", line: "Demands high accuracy and fast calculus speeds." };
      case "Chemistry": return { name: "Chemistry Miss", avatar: "🧪", line: "Demands complete memorization of carbonyl and benzene sheets." };
      default: return { name: "Maveeran Sir", avatar: "👺", line: "Strict and powerful; absolutely triggers when you surrender a physics timer." };
    }
  };

  const activeFac = getTeacherPersona(subject);

  return (
    <div id="teacher-post-container" className="flex-1 overflow-y-auto bg-zinc-950 p-6 lg:p-10 text-zinc-100 selection:bg-cyan-500/30">
      
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Title Section */}
        <div>
          <h1 className="text-3xl font-sans font-black text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-cyan-400 tracking-tight">
            Weekly Sheets Planner & Simulator Desk
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Simulate administrative homework posts. Adding pending tuition sheets triggers live alerts and wakes up competitors.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid md:grid-cols-12 gap-6 items-start">
          
          {/* Main Task Creator form (8 columns) */}
          <div className="md:col-span-8 space-y-6">
            <div className="bg-zinc-900 border border-zinc-850 rounded-xl p-5 lg:p-6 space-y-5">
              <h3 className="font-sans font-extrabold text-zinc-200 text-sm tracking-tight flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" /> Create Custom Pending Tuition Sheet
              </h3>

              {justAddedAlarm && (
                <div className="bg-emerald-950/25 border border-emerald-900/40 rounded-lg p-3 text-emerald-400 text-xs font-mono flex items-center gap-2">
                  <Check className="w-4 h-4 animate-bounce shrink-0" />
                  <span>Tuition sheet added successfully! Redirecting you to study desk...</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Select Subject */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 font-mono font-bold uppercase tracking-wider block">
                    Select Subject Faculty
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {["Physics", "Mathematics", "Chemistry"].map((sub) => {
                      const isSel = subject === sub;
                      return (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => setSubject(sub)}
                          className={`py-2 rounded px-1 text-center font-sans font-bold text-xs transition-all ${
                            isSel 
                              ? "bg-cyan-500 text-zinc-950 font-black shadow shadow-cyan-500/10" 
                              : "bg-zinc-950 border border-zinc-900 text-zinc-400 hover:text-zinc-200"
                          }`}
                        >
                          {sub}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Chapter Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 font-mono font-bold uppercase tracking-wider block">
                    Chapter Heading / Reference
                  </label>
                  <input
                    type="text"
                    value={chapter}
                    onChange={(e) => setChapter(e.target.value)}
                    placeholder="e.g. Definite Integrals, Gauss Law, Organic IUPAC"
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-cyan-500 rounded-lg px-3.5 py-2.5 text-zinc-200 text-xs focus:outline-none transition-colors"
                    required
                  />
                </div>

                {/* Task Title Details */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 font-mono font-bold uppercase tracking-wider block">
                    Study Tuition Details (What needs solving)
                  </label>
                  <textarea
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    rows={3}
                    placeholder="e.g. Solve 20 Advanced IIT-JEE calculus derivatives and integrals worksheets"
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-cyan-500 rounded-lg p-3.5 text-zinc-200 text-xs focus:outline-none transition-colors resize-none"
                    required
                  />
                </div>

                {/* Expected Timing timer limit */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <label className="text-[10px] text-zinc-500 font-mono font-bold uppercase tracking-wider block">
                      Assigned Timer Limit (minutes)
                    </label>
                    <span className="text-xs font-mono font-extrabold text-cyan-400">
                      {expectedMinutes} Minutes
                    </span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="120"
                    step="15"
                    value={expectedMinutes}
                    onChange={(e) => setExpectedMinutes(parseInt(e.target.value, 10))}
                    className="w-full h-1 bg-zinc-950 accent-cyan-400 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[8px] font-mono text-zinc-650">
                    <span>Quick (15m)</span>
                    <span>Standard Sheet (45m)</span>
                    <span>Deep Grind (120m)</span>
                  </div>
                </div>

                {/* Submission Button */}
                <button
                  id="submit-new-class-task-btn"
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-emerald-400 text-zinc-950 py-3 rounded-lg font-sans font-black text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/10 transition-transform active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3px]" />
                  <span>Release Tuition Sheet to Weekly Schedule</span>
                </button>

              </form>
            </div>

            {/* Quick Weekly Tuition Sheets Planner Presets Section */}
            <div className="bg-zinc-900 border border-zinc-850 rounded-xl p-5 lg:p-6 space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <h3 className="font-sans font-extrabold text-zinc-200 text-sm tracking-tight">
                  Rapid Tuition Sheets Week Planner
                </h3>
              </div>
              <p className="text-xs text-zinc-400 leading-normal">
                Click any standard preset homework goal below to instantly load your weekly study program. Best for filling the schedules with one click:
              </p>

              <div className="grid sm:grid-cols-2 gap-3.5">
                {[
                  {
                    subject: "Physics",
                    chapter: "Wave Optics",
                    title: "Derive Young's Interference and Diffraction worksheets",
                    mins: 45,
                    label: "📅 Mon - Physics Homework"
                  },
                  {
                    subject: "Mathematics",
                    chapter: "Differential Equations",
                    title: "Solve 15 homogeneous order equation derivatives",
                    mins: 60,
                    label: "📅 Wed - Maths Calculus Grind"
                  },
                  {
                    subject: "Chemistry",
                    chapter: "Chemical Kinetics",
                    title: "Memorize half-life formulas and activate kinetic graphs",
                    mins: 30,
                    label: "📅 Thu - Chemistry Kinetics"
                  },
                  {
                    subject: "Mathematics",
                    chapter: "Definite Integrals",
                    title: "IIT-JEE Advanced Integral 20 Integration practice sums",
                    mins: 75,
                    label: "📅 Sat - Extreme Calculus Sheet"
                  }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      addTask(item.subject, item.chapter, item.title, item.mins);
                      setJustAddedAlarm(true);
                      setTimeout(() => setJustAddedAlarm(false), 1200);
                    }}
                    className="text-left bg-zinc-950 border border-zinc-850 hover:border-zinc-700/65 p-3 rounded-lg hover:bg-zinc-900/40 transition-all cursor-pointer group"
                    title="Click to instantly append this homework sheet template to the pending list."
                  >
                    <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono mb-1">
                      <span>{item.label}</span>
                      <span className="text-emerald-400 font-bold">+{item.mins}m</span>
                    </div>
                    <h5 className="font-sans font-black text-zinc-200 text-xs leading-normal group-hover:text-cyan-400 transition-colors">
                      {item.chapter}: {item.title}
                    </h5>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Teacher metadata profile & Simulation desk (4 columns) */}
          <div className="md:col-span-4 space-y-6">
            
            {/* Faculty Info Desk */}
            <div className="bg-zinc-900 border border-zinc-850 rounded-xl p-4 space-y-3">
              <h4 className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest pl-1">
                Selected Faculty Persona
              </h4>
              <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-3 text-center space-y-2">
                <span className="text-2xl inline-block p-1 bg-zinc-900 rounded-lg border border-zinc-800">
                  {activeFac.avatar}
                </span>
                <h5 className="font-sans font-bold text-zinc-200 text-xs">
                  {activeFac.name} ({subject})
                </h5>
                <p className="text-[10px] text-zinc-400 leading-normal italic">
                  "{activeFac.line}"
                </p>
              </div>
            </div>

            {/* Automatic Schedule Rules */}
            <div className="bg-zinc-900 border border-zinc-850 rounded-xl p-4 space-y-3">
              <h4 className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest pl-1">
                Day-End Auto Sweeper
              </h4>
              <p className="text-[10px] text-zinc-400 leading-normal">
                At the end of your competitive study day, completed, failed, and missed tasks are automatically cleared. Only your newly planned pending sheets remain for the next curriculum race!
              </p>
            </div>

          </div>

        </div>

        {/* CURRENT SYLLABUS LIST OUT */}
        <div className="bg-zinc-900 border border-zinc-850 p-5 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 uppercase tracking-widest">
              <ListChecks className="w-4 h-4 text-cyan-400" /> Current Tuition syllabus index
            </div>
            <span className="text-[10px] font-mono text-zinc-500">
              Total sheets tracked: {tasks.length}
            </span>
          </div>

          {tasks.length > 0 ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-1">
              {tasks.map((t) => (
                <div key={t.id} className="flex flex-col justify-between p-3.5 bg-zinc-950 rounded-lg border border-zinc-900 space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono text-cyan-400 font-extrabold uppercase bg-cyan-950/30 border border-cyan-900/30 px-1.5 py-0.5 rounded">
                        {t.subject}
                      </span>
                      <span className="text-[9px] text-zinc-500 font-mono">{t.expectedMinutes} mins</span>
                    </div>
                    <span className="text-[10px] text-zinc-450 font-mono block">Ch: {t.chapter}</span>
                    <h5 className="font-sans font-black text-zinc-200 tracking-tight text-xs leading-tight">
                      {t.title}
                    </h5>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t border-zinc-900 text-[10px] font-mono">
                    <button
                      type="button"
                      onClick={() => deleteTask(t.id)}
                      className="p-1 px-2 rounded bg-zinc-900 border border-zinc-800 hover:bg-rose-950/30 hover:border-rose-900/40 text-zinc-400 hover:text-rose-400 transition-all flex items-center gap-1 cursor-pointer"
                      title="Delete this custom tuition sheet from schedule"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                    <span className={`px-2 py-0.5 rounded font-black ${
                      t.status === "completed" 
                        ? "text-emerald-400 bg-emerald-950/20 border border-emerald-900/30" 
                        : t.status === "failed"
                          ? "text-red-400 bg-red-950/20 border border-red-900/30"
                          : "text-zinc-500 bg-zinc-900"
                    }`}>
                      {t.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-zinc-500 font-mono border border-dashed border-zinc-850 rounded-lg bg-zinc-950/40">
              Syllabus is empty. Post some tuition schedule goals above to begin!
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
