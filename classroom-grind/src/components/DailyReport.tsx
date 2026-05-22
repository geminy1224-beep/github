import React from "react";
import { useClassroom } from "../context/ClassroomContext";
import { Award, Clock, Zap, Star, ShieldAlert, CheckCircle2, ChevronRight, UserMinus, Sparkles, MessageSquare } from "lucide-react";

export const DailyReport: React.FC = () => {
  const { reports, user, classmates, setActiveTab } = useClassroom();

  // Pick the latest report or generic fallback
  const latestReport = reports[0] || {
    id: "rep-placeholder",
    date: "Current session progress logs",
    studyHours: user.studyHours,
    xpEarned: 150,
    tasksCompleted: 2,
    missedTimers: 0,
    fastestSubmission: "Electromagnetism in 22 mins",
    rankMovement: "Overtook classmates Guna & Sameer",
    rank: 6,
    teacherRemarks: "Maveeran Sir says: \"Physics relies on absolute devotion, Hemanth! Continuous focus is required to catch up with Kishore!\"",
    friendReactions: [
      "Kishore: 'Hmm, 0.0 hours log is lazy da, I already reached 11.8 hours long back. Step up, bro! 😜'",
      "Aakash: 'Fabulous work da machi! Your study velocity is amazing today! 🔥⚡'",
      "Sameer: 'Extremely neat integrations. All the best for tomorrow Hemanth!'"
    ],
    badges: ["Most Consistent", "Comeback Player"],
    leaderboardSnapshot: [
      { name: "Kishore", xp: 1580, rank: 1 },
      { name: "Rayyan", xp: 1510, rank: 2 },
      { name: "Hemanth (You)", xp: user.xp, rank: 6 }
    ]
  };

  const getBadgeColors = (badgeName: string) => {
    switch (badgeName) {
      case "Fastest Finisher": return "from-amber-500 to-yellow-400 text-yellow-100 border-yellow-500/30";
      case "Most Consistent": return "from-emerald-500 to-teal-400 text-teal-100 border-emerald-500/30";
      case "9-Hour Beast": return "from-purple-600 to-indigo-500 text-indigo-100 border-purple-500/30";
      case "Comeback Player": return "from-red-500 to-pink-500 text-pink-100 border-rose-500/30";
      default: return "from-cyan-500 to-blue-500 text-cyan-100 border-cyan-500/30";
    }
  };

  return (
    <div id="daily-report-container" className="flex-1 overflow-y-auto bg-zinc-950 p-6 lg:p-10 text-zinc-100 selection:bg-cyan-500/30">
      
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Top Celebration Cards Header */}
        <div className="text-center space-y-3 relative py-4 overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-850 p-6">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -mt-32"></div>
          <p className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> DAILY TUITION REPORT REPORT TERMINATED
          </p>
          <h1 className="text-3xl font-sans font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-200 to-cyan-400">
            {latestReport.date} Summary
          </h1>
          <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
            Your teacher logs are submitted successfully. The student profile has been updated in the global leaderboard! Let's check your stats.
          </p>
        </div>

        {/* CORE SUMMARY NUMBERS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="bg-zinc-900 border border-zinc-850 rounded-xl p-4.5 space-y-2 text-center">
            <Clock className="w-5 h-5 text-cyan-400 mx-auto" />
            <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider block">Logged Hours</span>
            <div className="text-2xl font-sans font-black text-zinc-100">{latestReport.studyHours.toFixed(1)}h</div>
            <span className="text-[9px] text-zinc-500 font-mono">Daily Target: {user.dailyTargetHours}h</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-850 rounded-xl p-4.5 space-y-2 text-center">
            <Zap className="w-5 h-5 text-amber-400 mx-auto" />
            <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider block">XP Gained</span>
            <div className="text-2xl font-sans font-black text-amber-400">+{latestReport.xpEarned} XP</div>
            <span className="text-[9px] text-zinc-500 font-mono">Lobby bonus applied</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-850 rounded-xl p-4.5 space-y-2 text-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" />
            <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider block">Completed sheets</span>
            <div className="text-2xl font-sans font-black text-zinc-100">{latestReport.tasksCompleted} Tasks</div>
            <span className="text-[9px] text-zinc-500 font-mono">Missed count: {latestReport.missedTimers}</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-850 rounded-xl p-4.5 space-y-2 text-center">
            <Star className="w-5 h-5 text-yellow-400 mx-auto" />
            <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider block">Lobby Rankings</span>
            <div className="text-2xl font-sans font-black text-yellow-400">Rank #{latestReport.rank}</div>
            <span className="text-[9px] text-emerald-400 font-mono font-bold">{latestReport.rankMovement}</span>
          </div>

        </div>

        {/* DOUBLE COLUMN: BADGES & TEACHER REMARKS */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* BADGES SECTION */}
          <div className="bg-zinc-900 border border-zinc-850 rounded-xl p-5 space-y-4">
            <div className="flex gap-2 items-center text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">
              <Award className="w-4 h-4 text-cyan-400" /> Earned Class Badges
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {latestReport.badges.map((b) => (
                <div 
                  key={b} 
                  className={`bg-gradient-to-tr ${getBadgeColors(b)} p-3 rounded-lg border text-center font-sans font-bold flex flex-col justify-between items-center space-y-2 relative overflow-hidden`}
                >
                  <div className="absolute top-0 right-0 w-8 h-8 bg-white/5 rounded-full blur"></div>
                  <span className="text-2xl">🏆</span>
                  <div>
                    <h5 className="text-xs font-black tracking-tight leading-none text-white">{b}</h5>
                    <span className="text-[8px] font-mono text-white/60 block mt-1 uppercase">Unlocked</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TEACHER STRICT FEEDBACK */}
          <div className="bg-zinc-900 border border-zinc-850 rounded-xl p-5 flex flex-col justify-between space-y-4">
            <div className="flex gap-2 items-center text-zinc-400 text-xs font-mono font-bold uppercase tracking-widest">
              <ShieldAlert className="w-4 h-4 text-rose-500" /> Faculty Notice & Remarks
            </div>

            <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-4 space-y-2 relative">
              <span className="absolute -top-3.5 -left-1 text-3xl">👺</span>
              <p className="text-xs text-zinc-300 font-sans italic leading-relaxed pt-1.5">
                {latestReport.teacherRemarks}
              </p>
            </div>

            <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
              Issued by: Class Superintendent Board
            </div>
          </div>

        </div>

        {/* LOWER SECTION: RIVAL & FRIEND REACTIONS */}
        <div className="bg-zinc-900 border border-zinc-850 rounded-xl p-5 space-y-4">
          <div className="flex gap-2 items-center text-zinc-400 text-xs font-mono font-bold uppercase tracking-widest">
            <MessageSquare className="w-4 h-4 text-cyan-400" /> Classroom Reaction Banter
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {latestReport.friendReactions.map((reactLine, idx) => {
              const namePart = reactLine.split(":")[0];
              const textPart = reactLine.split(":")[1] || "";
              
              let bubbleBorderAndBg = "border-zinc-800 bg-zinc-950 text-zinc-300";
              let emojiIndicator = "🌸";

              if (namePart.includes("Kishore")) {
                bubbleBorderAndBg = "border-red-950 bg-red-950/15 text-red-50";
                emojiIndicator = "⚡";
              } else if (namePart.includes("Aakash")) {
                bubbleBorderAndBg = "border-cyan-950 bg-cyan-950/10 text-cyan-200";
                emojiIndicator = "🚀";
              }

              return (
                <div key={idx} className={`p-4 border rounded-xl space-y-1.5 ${bubbleBorderAndBg}`}>
                  <h5 className="text-xs font-sans font-black flex items-center gap-1.5 tracking-tight">
                    <span>{emojiIndicator}</span> {namePart}
                  </h5>
                  <p className="text-[11px] leading-relaxed italic text-zinc-300">
                    {textPart}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* SYLLABUS DIRECT ACTION */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-zinc-900 border border-zinc-850 rounded-xl p-4 gap-4">
          <div className="space-y-0.5">
            <h4 className="font-sans font-bold text-zinc-200 text-sm">Review Complete for the Class!</h4>
            <p className="text-xs text-zinc-500">Ready to head back to the Tuition Desk to start tomorrow's chapter formulas?</p>
          </div>
          <button
            id="back-to-grind-desk-btn"
            onClick={() => setActiveTab("dashboard")}
            className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-sans font-black text-xs px-5 py-3.5 rounded-lg flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
          >
            <span>Back to the Grind Lobby</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
