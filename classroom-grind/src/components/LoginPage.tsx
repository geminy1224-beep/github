import React, { useState } from "react";
import { useClassroom } from "../context/ClassroomContext";
import { User, Eye, Sparkles, LogIn, ChevronRight, Flame } from "lucide-react";

export const LoginPage: React.FC = () => {
  const { loginUser } = useClassroom();
  const [username, setUsername] = useState("Hemanth");
  const [targetHours, setTargetHours] = useState(9);
  const [avatar, setAvatar] = useState("🤠");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser(username, targetHours);
  };

  const avatars = ["🤠", "🎓", "⚡", "👾", "🧠", "🔥", "🚀"];

  return (
    <div id="login-container" className="flex-1 overflow-y-auto bg-zinc-950 flex items-center justify-center p-6 selection:bg-cyan-500/30">
      
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-850 rounded-2xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>

        <div className="text-center space-y-2 mb-8 relative">
          <div className="inline-flex w-12 h-12 rounded-xl bg-cyan-950/40 border border-cyan-800/40 items-center justify-center text-cyan-400 text-xl font-mono mb-2">
            🏆
          </div>
          <h2 className="text-2xl font-sans font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-cyan-400">
            CLASSROOM GRIND
          </h2>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto">
            Competitive Social Pressure & Tuitions for Solo Students
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative">
          
          {/* Avatar Selector */}
          <div className="space-y-2">
            <label className="text-[10px] text-zinc-500 font-mono font-bold uppercase tracking-wider block">
              Choose Student Identity
            </label>
            <div className="grid grid-cols-7 gap-2">
              {avatars.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => setAvatar(av)}
                  className={`py-2 rounded-lg text-lg flex items-center justify-center transition-all ${
                    avatar === av 
                      ? "bg-zinc-800 border border-cyan-400/50 text-white scale-110 shadow-lg shadow-cyan-500/10" 
                      : "bg-zinc-950 border border-zinc-900 text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          {/* Student Username */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-zinc-500 font-mono font-bold uppercase tracking-wider block">
              Student Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="HeManth"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-zinc-200 text-sm focus:outline-none focus:border-cyan-400 transition-colors placeholder:text-zinc-700"
                required
              />
              <span className="absolute right-3.5 top-3 text-[10px] font-mono text-zinc-600 uppercase">
                Active
              </span>
            </div>
          </div>

          {/* Target Study Hours */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] text-zinc-500 font-mono font-bold uppercase tracking-wider block">
                Daily Study Target (Hours)
              </label>
              <span className="text-xs font-mono font-black text-cyan-400">
                {targetHours} hours
              </span>
            </div>
            
            <input
              type="range"
              min="4"
              max="16"
              value={targetHours}
              onChange={(e) => setTargetHours(parseInt(e.target.value, 10))}
              className="w-full accent-cyan-400 bg-zinc-950 h-1.5 rounded-lg appearance-none cursor-pointer border border-zinc-900"
            />
            <div className="flex justify-between text-[8px] font-mono text-zinc-600">
              <span>Chiller (4h)</span>
              <span>JEE Standard (9h)</span>
              <span>Sigma Alien (16h)</span>
            </div>
          </div>

          {/* Social Warning Pitch */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-3 text-left">
            <div className="flex gap-2.5 items-start">
              <span className="text-sm">🗣️</span>
              <p className="text-[10px] text-zinc-400 leading-normal">
                Authentic competitive lobby will be booted. Kishore (Your rival) is currently study active and has already logged 5.4 hours today to trigger deep peer pressure.
              </p>
            </div>
          </div>

          {/* Submit Action */}
          <button
            id="join-lobby-submit-btn"
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-zinc-950 py-3 rounded-lg font-bold text-sm tracking-tight flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
          >
            <span>Enter Tuition Lobby</span>
            <ChevronRight className="w-4 h-4" />
          </button>

        </form>

        <p className="text-[10px] text-center text-zinc-600 mt-6 font-mono">
          Free cloud-hosted demo powered by Google AI Studio
        </p>

      </div>

    </div>
  );
};
