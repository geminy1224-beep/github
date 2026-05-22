import React, { useState } from "react";
import { useClassroom } from "../context/ClassroomContext";
import { History, Calendar, Award, GraduationCap, ChevronDown, ChevronUp, FileSpreadsheet, CheckCircle2, AlertTriangle } from "lucide-react";
import { ClassReport } from "../types";

export const PastLogs: React.FC = () => {
  const { reports } = useClassroom();
  const [expandedReportId, setExpandedReportId] = useState<string | null>(null);

  const toggleReport = (id: string) => {
    setExpandedReportId(prev => (prev === id ? null : id));
  };

  return (
    <div id="past-logs-container" className="flex-1 overflow-y-auto bg-zinc-950 p-6 lg:p-10 text-zinc-100 selection:bg-cyan-500/30">
      
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header title */}
        <div>
          <h1 className="text-3xl font-sans font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-cyan-400">
            Daily Progress Archive
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Browse through your historically saved End-of-Class Tuition sheets and leaderboard records.
          </p>
        </div>

        {/* List of Reports */}
        <div className="space-y-4">
          {reports.length > 0 ? (
            reports.map((rep) => {
              const isExpanded = expandedReportId === rep.id;
              
              return (
                <div 
                  key={rep.id} 
                  id={`archive-report-${rep.id}`}
                  className="bg-zinc-900 border border-zinc-850 rounded-xl overflow-hidden hover:border-zinc-750 transition-colors"
                >
                  
                  {/* Collapsed top bar preview */}
                  <div 
                    onClick={() => toggleReport(rep.id)}
                    className="p-4 lg:p-5 flex justify-between items-center cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-lg bg-cyan-950/20 border border-cyan-800/20 text-cyan-400 flex items-center justify-center text-sm">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-sans font-bold text-zinc-100 text-sm leading-tight">
                          {rep.date}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] font-mono text-cyan-400">
                            {rep.studyHours.toFixed(1)}h logged
                          </span>
                          <span className="text-[9px] text-zinc-650">•</span>
                          <span className="text-[9px] font-mono text-zinc-400">
                            Rank #{rep.rank}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <span className="text-[10px] text-zinc-500 font-mono uppercase font-semibold">Earned XP</span>
                        <div className="text-sm font-sans font-black text-amber-500 font-mono">+{rep.xpEarned} XP</div>
                      </div>
                      <div className="text-zinc-500">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded detail view */}
                  {isExpanded && (
                    <div className="p-5 border-t border-zinc-950 bg-zinc-900/60 space-y-5">
                      
                      {/* Sub Grid metrics */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="bg-zinc-950/60 p-3 rounded border border-zinc-900 text-center">
                          <span className="text-[9px] text-zinc-500 uppercase font-bold block">Study duration</span>
                          <span className="text-sm font-sans font-black text-cyan-400">{rep.studyHours.toFixed(1)} Hours</span>
                        </div>
                        <div className="bg-zinc-950/60 p-3 rounded border border-zinc-900 text-center">
                          <span className="text-[9px] text-zinc-500 uppercase font-bold block">XP earned</span>
                          <span className="text-sm font-sans font-black text-amber-500 font-mono">+{rep.xpEarned} XP</span>
                        </div>
                        <div className="bg-zinc-950/60 p-3 rounded border border-zinc-900 text-center">
                          <span className="text-[9px] text-zinc-500 uppercase font-bold block">Submitted tasks</span>
                          <span className="text-sm font-sans font-black text-emerald-400">{rep.tasksCompleted} Sheets</span>
                        </div>
                        <div className="bg-zinc-950/60 p-3 rounded border border-zinc-900 text-center">
                          <span className="text-[9px] text-zinc-500 uppercase font-bold block">Fastest run</span>
                          <span className="text-[10px] font-sans font-extrabold text-indigo-400 line-clamp-1 mt-0.5">{rep.fastestSubmission || "Gauss Law (18m)"}</span>
                        </div>
                      </div>

                      {/* Achievements/Badges */}
                      <div className="space-y-1.5">
                        <span className="text-[9px] text-zinc-500 uppercase font-bold text-[10px] tracking-wider block font-mono">
                          Class Badges Awarded
                        </span>
                        <div className="flex flex-wrap gap-2 text-xs">
                          {rep.badges.map(b => (
                            <span key={b} className="bg-zinc-950/80 border border-cyan-800/20 text-cyan-400 py-1 px-2.5 rounded text-[10px] font-bold font-sans">
                              🏆 {b}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Teacher remark block */}
                      <div className="space-y-1.5">
                        <span className="text-[9px] text-zinc-500 uppercase font-bold text-[10px] tracking-wider block font-mono">
                          Official feedback & Remarks
                        </span>
                        <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-3 text-xs text-zinc-300 italic">
                          {rep.teacherRemarks}
                        </div>
                      </div>

                      {/* Snapshots of leaderboard rankings */}
                      <div className="space-y-2">
                        <span className="text-[9px] text-zinc-500 uppercase font-bold text-[10px] tracking-wider block font-mono">
                          Leaderboard Snapshots
                        </span>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px]">
                          {rep.leaderboardSnapshot.slice(0, 4).map((record) => (
                            <div key={record.name} className="bg-zinc-950 p-2 rounded border border-zinc-900 flex justify-between">
                              <span className="text-zinc-400 font-medium truncate">{record.rank}. {record.name}</span>
                              <span className="text-cyan-400 font-bold font-mono">{record.xp} XP</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              );
            })
          ) : (
            <div className="bg-zinc-900/60 rounded-xl p-10 text-center border border-dashed border-zinc-850">
              <FileSpreadsheet className="w-12 h-12 text-zinc-650 mx-auto mb-3" />
              <h3 className="font-sans font-extrabold text-zinc-300">Pristine Progress Folder</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1 leading-normal">
                You haven't locked in daily tuition logs yet. Access the <strong>Tuition Desk</strong>, complete task assignments, and trigger <strong>"Call End Class"</strong> to see your statistics show up in this history tab!
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
