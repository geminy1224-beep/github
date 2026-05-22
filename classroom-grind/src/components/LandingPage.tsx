import React from "react";
import { useClassroom } from "../context/ClassroomContext";
import { 
  Flame, 
  Trophy, 
  Heart, 
  ArrowRight, 
  BookOpen, 
  Zap, 
  Sparkles, 
  ShieldAlert
} from "lucide-react";

export const LandingPage: React.FC = () => {
  const { user, classmates, isJoinedClassroom, joinClassroom, setActiveTab } = useClassroom();

  return (
    <div id="landing-container" className="flex-1 overflow-y-auto bg-zinc-950 p-6 lg:p-10 text-zinc-100 selection:bg-cyan-500/30">
      
      {/* Hero Header Selection */}
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-cyan-950/40 p-8 lg:p-12 border border-zinc-800 shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -ml-20 -mb-20"></div>

          <div className="relative space-y-6">
            <div className="inline-flex items-center gap-2 bg-cyan-900/30 border border-cyan-500/20 px-3.5 py-1.5 rounded-full">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                Competitive Tuition Lobby V1.2.0
              </span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-sans font-black tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-100 to-cyan-400">
              Stop Studying Alone. <br />
              <span className="text-cyan-400">Let Rivalry Drive You.</span>
            </h1>

            <p className="text-sm lg:text-base text-zinc-400 leading-relaxed max-w-2xl">
              Welcome to <strong className="text-zinc-200">Classroom Grind</strong> — a virtual tuition workspace tailored for <strong className="text-cyan-400">Hemanth</strong> & similar high-achiever students who study best under social pressure, direct peer competition, and real-time sarcastic banter from genius rivals.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {isJoinedClassroom ? (
                <button
                  id="hero-go-to-desk-btn"
                  onClick={() => setActiveTab("dashboard")}
                  className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 px-6 py-3 rounded-lg font-bold text-sm tracking-tight flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-[1.02] shadow-lg shadow-cyan-500/20 active:scale-95 cursor-pointer"
                >
                  Enter Your Tuition Desk
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  id="hero-join-classroom-btn"
                  onClick={joinClassroom}
                  className="bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-zinc-950 px-8 py-3.5 rounded-lg font-sans font-black text-sm tracking-tight flex items-center justify-center gap-2.5 transition-all duration-200 transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  Join Simulated Lobby
                  <Flame className="w-4 h-4 text-zinc-950 animate-bounce" />
                </button>
              )}
              
              <button
                id="hero-see-analytics-btn"
                onClick={() => setActiveTab("analytics")}
                className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 px-6 py-3 rounded-lg font-mono font-semibold text-xs border border-zinc-800 hover:border-zinc-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                Inspect Focus Analytics
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Concept Explanation */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-zinc-900 border border-zinc-850 p-5 rounded-xl hover:border-zinc-750 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5 text-red-400" />
            </div>
            <h3 className="font-sans font-bold text-zinc-200">The Kishore Threat</h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Chennai's biggest competitive threat. Starts tasks instantly, submits early, and drops sarcastic Tanglish comments immediately to shatter your peace of mind.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-850 p-5 rounded-xl hover:border-zinc-750 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
              <Trophy className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="font-sans font-bold text-zinc-200">9-Hour Daily Threshold</h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Designed around Hemanth's strict 9-hour study target. Earn a massive +100 XP Super Bonus by locking this in, or lose XP on missed deadlines.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-850 p-5 rounded-xl hover:border-zinc-750 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-4">
              <Heart className="w-5 h-5 text-pink-400" />
            </div>
            <h3 className="font-sans font-bold text-zinc-200">Interactive Support Line</h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              When Kishore is teasing too hard, Aakash logs in to hype your comeback streak, and Sameer advises slow, absolute conceptual rigor.
            </p>
          </div>
        </div>

        {/* Meet the AI Classmates Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h2 className="text-xl font-sans font-black text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-cyan-400">
                Tuition Classmate Directory
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">Meet your active rivals, silent toppers, and supportive friends</p>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-1 rounded border border-cyan-900">
              Active Lobby size: {classmates.length}
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {classmates.map((student) => {
              // Custom colors based on role
              let roleClass = "text-zinc-500 bg-zinc-950 border-zinc-900";
              let badgeLabel = student.role;

              if (student.role === "rival") {
                roleClass = "text-red-400 bg-red-950/25 border-red-900/40 ring-1 ring-red-500/10";
                badgeLabel = "👑 Arch-Rival";
              } else if (student.role === "topper") {
                roleClass = "text-yellow-400 bg-yellow-950/25 border-yellow-900/40 ring-1 ring-yellow-500/10";
                badgeLabel = "🎯 Silent Topper";
              } else if (student.role === "hype") {
                roleClass = "text-cyan-400 bg-cyan-950/25 border-cyan-900/40 ring-1 ring-cyan-500/10";
                badgeLabel = "🚀 Hype Comrade";
              } else if (student.role === "support") {
                roleClass = "text-pink-400 bg-pink-950/25 border-pink-900/40 ring-1 ring-pink-500/10";
                badgeLabel = "🌸 Support Pillar";
              }

              // Representative funny quotes
              const sampleQuotes: { [it: string]: string } = {
                "Kishore": "“dei naa 20 sums mudichiten da 😭🔥 timer set panna easy da, mudikka dhan kashtam 😏”",
                "Rayyan": "“Done. Working closely with Physics chapter 4 formula derivations now.”",
                "Guru": "“Azzez, did sir specify definite integration limits in sheet 2?”",
                "Azzez": "“Organic equations are highly volatile. Solving nomenclature page 15.”",
                "Guna": "“Studying quietly. Please don't let Kishore start typing in all-caps again.”",
                "Sameer": "“nee panniduva da machi, don't rush, step correctness counts! 🌸”",
                "Aakash": "“comeback arc loading da machi! 😤⚡ let's show Kishore what we are!”"
              };

              return (
                <div 
                  key={student.id} 
                  id={`mate-${student.id}`}
                  className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-4 flex flex-col justify-between hover:scale-[1.01] transition-transform duration-200"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{student.avatar}</span>
                        <div>
                          <h4 className="font-sans font-bold text-zinc-100 flex items-center gap-1.5 leading-tight">
                            {student.name}
                          </h4>
                          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${roleClass} uppercase font-bold tracking-wide mt-1 inline-block`}>
                            {badgeLabel}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-cyan-400 block">{student.xp} XP</span>
                        <span className="text-[10px] text-zinc-500 font-mono block">{student.studyHours.toFixed(1)}h logged</span>
                      </div>
                    </div>

                    <p className="text-xs italic text-zinc-300 font-sans border-l-2 border-zinc-700 pl-2.5 py-1">
                      {sampleQuotes[student.name] || `“${student.statusText}”`}
                    </p>
                  </div>

                  {/* Progress simulator line */}
                  <div className="mt-4 pt-3 border-t border-zinc-900">
                    <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500 mb-1">
                      <span>Task Progress</span>
                      <span>{student.currentTaskProgress}%</span>
                    </div>
                    <div className="w-full h-1 bg-zinc-950 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-cyan-500" 
                        style={{ width: `${student.currentTaskProgress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Faculty Warning Panel */}
        <div className="bg-zinc-900/60 border border-red-950/30 rounded-xl p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-lg bg-red-950/40 border border-red-900/30 flex items-center justify-center shrink-0 text-xl">
              👺
            </div>
            <div>
              <h4 className="font-sans font-bold text-red-400 text-sm">Strict Oversight: Maveeran Sir & Faculty</h4>
              <p className="text-xs text-zinc-400 mt-1 max-w-lg">
                Physics instructor Maveeran Sir is extremely demanding. If you look at WhatsApp or let your study timer expire without submission, he will notice immediately and mock your discipline in the live classroom chat.
              </p>
            </div>
          </div>
          <span className="text-[10px] bg-red-950/35 border border-red-900/30 text-red-400 font-mono py-1 px-2.5 rounded shrink-0 uppercase tracking-widest">
            Rules strictly applied
          </span>
        </div>

        {/* Reset portal for demo workflow test */}
        <div className="text-center pt-4">
          <p className="text-xs text-zinc-600 font-mono">
            Tired of simulating? You can always reset all statistics to explore from scratch.
          </p>
          <button
            id="see-reset-button"
            onClick={() => setActiveTab("admin")}
            className="text-xs font-semibold py-1 px-3 text-zinc-500 hover:text-cyan-400 mt-2 font-mono transition-colors underline"
          >
            Go to Admin/Teacher tools
          </button>
        </div>

      </div>
    </div>
  );
};
