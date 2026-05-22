import React from "react";
import { useClassroom } from "../context/ClassroomContext";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { 
  BarChart2, 
  TrendingUp, 
  Clock, 
  BrainCircuit, 
  HelpCircle, 
  AlertTriangle, 
  Sparkles, 
  Lightbulb,
  CheckCircle2
} from "lucide-react";

export const WeeklyAnalyticsView: React.FC = () => {
  const { weeklyAnalytics, user } = useClassroom();

  // Simple static weekly distribution hours for Hemanth for chart visualization
  const weeklyData = [
    { day: "Mon", Hours: 3.2, KishoreHours: 5.1 },
    { day: "Tue", Hours: 6.5, KishoreHours: 6.8 },
    { day: "Wed", Hours: 8.5, KishoreHours: 8.2 },
    { day: "Thu", Hours: 7.4, KishoreHours: 7.0 },
    { day: "Fri", Hours: 9.1, KishoreHours: 8.5 },
    { day: "Sat", Hours: 8.7, KishoreHours: 9.2 },
    { day: "Sun", Hours: 5.2, KishoreHours: 6.0 }
  ];

  return (
    <div id="weekly-analytics-container" className="flex-1 overflow-y-auto bg-zinc-950 p-6 lg:p-10 text-zinc-100 selection:bg-cyan-500/30">
      
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-3xl font-sans font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-cyan-400">
              Weekly Performance Analytics
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Data science insight regarding Hemanth's focus baseline, pressure responses, and subject-wise averages.
            </p>
          </div>
          <span className="text-[10px] bg-cyan-950/45 border border-cyan-800/30 text-cyan-400 font-mono py-1 px-3 rounded uppercase font-bold tracking-widest">
            Metrics calculated weekly
          </span>
        </div>

        {/* CORE ANALYTICS STATS METRIC BENTO GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="bg-zinc-900 border border-zinc-850 rounded-xl p-4.5 space-y-1.5 flex flex-col justify-between">
            <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider block">Total Hours</span>
            <div className="text-2xl font-sans font-black text-cyan-400">{weeklyAnalytics.totalWeeklyHours}h</div>
            <p className="text-[9px] text-zinc-500">Total logged across syllabus</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-850 rounded-xl p-4.5 space-y-1.5 flex flex-col justify-between">
            <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider block">Daily Average</span>
            <div className="text-2xl font-sans font-black text-emerald-400">{weeklyAnalytics.dailyAverage}h/day</div>
            <p className="text-[9px] text-zinc-500">Baseline calculated study length</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-850 rounded-xl p-4.5 space-y-1.5 flex flex-col justify-between">
            <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider block">Strongest Field</span>
            <div className="text-lg font-sans font-black text-yellow-500 line-clamp-1 truncate">{weeklyAnalytics.strongestSubject}</div>
            <p className="text-[9px] text-zinc-500">Max submissions recorded</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-850 rounded-xl p-4.5 space-y-1.5 flex flex-col justify-between">
            <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider block">Missed Timers</span>
            <div className="text-2xl font-sans font-black text-rose-500">{weeklyAnalytics.missedTimerCount} Sheets</div>
            <p className="text-[9px] text-zinc-500">Forfeited study count</p>
          </div>

        </div>

        {/* HIGH-FIDELITY STUDY HOURS WEEKLY CHART COMPARISON */}
        <div className="bg-zinc-900 border border-zinc-850 rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="space-y-0.5">
              <h4 className="font-sans font-extrabold text-sm text-zinc-200 tracking-tight flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-cyan-400" /> Hemanth vs Kishore (My Arch-Rival) Study Hours
              </h4>
              <p className="text-[11px] text-zinc-500">Observe how Kishore's study length pushes your baseline on Wednesdays & Fridays!</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-cyan-400 block"></span> Hemanth</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-red-500 block"></span> Kishore (Bot)</span>
            </div>
          </div>

          {/* Simple Custom Simulated Bar Chart with CSS to guarantee flawless iframe performance without third-party chart loading delay! */}
          <div className="space-y-3 pt-2">
            {weeklyData.map((d) => {
              // Custom percentages for chart styling
              const myHeightPercent = (d.Hours / 10) * 100;
              const kishoreHeightPercent = (d.KishoreHours / 10) * 100;
              
              return (
                <div key={d.day} className="grid grid-cols-12 items-center text-xs">
                  <span className="col-span-1 font-mono text-zinc-400 font-bold">{d.day}</span>
                  <div className="col-span-11 space-y-1.5 pl-2">
                    {/* Hemanth Bar */}
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-zinc-950 h-3 rounded overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400"
                          style={{ width: `${myHeightPercent}%` }}
                        ></div>
                      </div>
                      <span className="font-mono text-[10px] text-cyan-400 font-bold w-10 text-right">{d.Hours.toFixed(1)}h</span>
                    </div>

                    {/* Kishore Bar */}
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-zinc-950 h-2 rounded overflow-hidden">
                        <div 
                          className="h-full bg-red-500"
                          style={{ width: `${kishoreHeightPercent}%` }}
                        ></div>
                      </div>
                      <span className="font-mono text-[10px] text-red-400 font-bold w-10 text-right">{d.KishoreHours.toFixed(1)}h</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FOCUS BASELINE & RIVAL BRAIN INTELLIGENCE */}
        <div className="bg-zinc-900 border border-zinc-850 p-5 rounded-xl space-y-4">
          <div className="flex items-center gap-2 text-zinc-300 text-xs font-mono font-bold uppercase tracking-widest leading-none">
            <BrainCircuit className="w-4 h-4 text-cyan-400" /> Focus Baseline Analysis
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed font-sans">
            {weeklyAnalytics.focusBaseline}
          </p>

          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-900 space-y-1">
              <span className="text-[9px] text-zinc-500 uppercase font-bold block">Weakest log factor</span>
              <h5 className="font-sans font-bold text-zinc-200 text-xs">
                {weeklyAnalytics.weakestDay}
              </h5>
              <p className="text-[10px] text-zinc-500 mt-1 leading-normal">
                Kishore's active teasing and sarcasm peaks on Mondays, drop-starting formulas is advised.
              </p>
            </div>

            <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-900 space-y-1">
              <span className="text-[9px] text-zinc-500 uppercase font-bold block">Best session log peak</span>
              <h5 className="font-sans font-bold text-zinc-200 text-xs">
                {weeklyAnalytics.bestDay}
              </h5>
              <p className="text-[10px] text-zinc-500 mt-1 leading-normal">
                Midweek, your integration and calculus velocity reaches massive heights.
              </p>
            </div>
          </div>
        </div>

        {/* IMPROVEMENT STRATEGIC SUGGESTIONS */}
        <div className="bg-zinc-900 border border-zinc-850 p-5 rounded-xl space-y-4">
          <div className="flex items-center gap-2 text-zinc-350 text-xs font-mono font-black uppercase tracking-widest leading-none">
            <Lightbulb className="w-4 h-4 text-amber-500" /> Custom Strategic Tips for Hemanth
          </div>

          <div className="space-y-3">
            {weeklyAnalytics.suggestions.map((s, idx) => (
              <div key={idx} className="flex gap-3 items-start text-xs text-zinc-300 leading-normal">
                <span className="text-md select-none mt-0.5">💡</span>
                <p>{s}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
