import React, { useState, useRef, useEffect } from "react";
import { useClassroom } from "../context/ClassroomContext";
import { 
  Play, 
  Pause, 
  CheckCircle, 
  Trash2, 
  Send, 
  Trophy, 
  Clock, 
  Flame, 
  Bell, 
  Users, 
  Zap, 
  BookOpen, 
  Sparkles,
  HelpCircle,
  Volume2
} from "lucide-react";
import { Task, Classmate } from "../types";

export const TuitionDesk: React.FC = () => {
  const {
    user,
    classmates,
    tasks,
    activeTask,
    messages,
    timerSeconds,
    expectedTimerSeconds,
    activeChattingMocker,
    classroomStatus,
    selectTask,
    startStudyTimer,
    pauseStudyTimer,
    resumeStudyTimer,
    submitTask,
    deleteCurrentTimer,
    sendUserMessage,
    simulateClassmateActivity,
    assignStudyTime
  } = useClassroom();

  const [inputMessage, setInputMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    const txt = inputMessage;
    setInputMessage("");
    await sendUserMessage(txt);
  };

  // Convert timer seconds to dynamic readable format
  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Dynamic calculations
  const progressPercent = expectedTimerSeconds > 0 
    ? Math.min(100, Math.round((timerSeconds / expectedTimerSeconds) * 100)) 
    : 0;

  // Determine leaderboard ranks
  const leaderboardList = [
    { name: `${user.name} (You)`, avatar: "🤠", xp: user.xp, hours: user.studyHours, isUser: true },
    ...classmates.map(c => ({ name: c.name, avatar: c.avatar, xp: c.xp, hours: c.studyHours, isUser: false }))
  ].sort((a,b) => b.xp - a.xp);

  const pendingHomeworkTasks = tasks.filter(t => t.status === 'pending');

  return (
    <div id="tuition-desk-container" className="flex-1 flex flex-col lg:flex-row bg-zinc-950 overflow-hidden relative selection:bg-cyan-500/30">
      
      {/* LEFT COLUMN: Tasks, Timer & Peers monitors (60% width on Desktop) */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 lg:max-h-screen">
        
        {/* Header Status Bar info */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-zinc-900 border border-zinc-850 rounded-xl p-4 gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse inline-block"></span>
              <span>LOBBY BROADCAST</span>
            </div>
            <p className="text-sm font-sans font-bold text-zinc-100 mt-1 uppercase tracking-tight">
              {classroomStatus}
            </p>
          </div>
          <div className="flex gap-2.5">
            <button
               id="trigger-lobby-simulation-btn"
               onClick={simulateClassmateActivity}
               disabled={!activeTask}
               className={`text-xs font-mono font-bold px-3 py-1.5 rounded transition-all ${
                 activeTask 
                   ? "bg-zinc-800 border border-cyan-800 text-cyan-400 hover:bg-zinc-750 hover:border-cyan-500 cursor-pointer" 
                   : "text-zinc-600 border border-zinc-900 bg-zinc-950 cursor-not-allowed"
               }`}
               title="Simulates math formulas derivations, organic reactions steps, or task checkpoints for classmates"
            >
              ⚡ Speed rival progress
            </button>
            <button
              id="early-end-class-trigger-btn"
              onClick={pauseStudyTimer}
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-sans font-bold text-xs px-3 py-1.5 rounded transition-colors shadow-lg shadow-emerald-500/10 cursor-pointer flex items-center gap-1"
              title="Pauses the active study session so you can take a well-deserved break and return anytime!"
            >
              <span>🟢 Take Break</span>
            </button>
          </div>
        </div>

        {/* CORE TIMER + CURRENT TASK CARD */}
        <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-cyan-950/20 border border-zinc-800 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl"></div>
          
          {activeTask ? (
            <div className="space-y-6">
              
              {/* Header Details */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-cyan-500/15 border border-cyan-400/20 text-cyan-400 font-mono py-0.5 px-2 rounded-sm uppercase tracking-wider">
                      {activeTask.subject}
                    </span>
                    <span className="text-zinc-500 text-xs font-mono">
                      Expected limit: {activeTask.expectedMinutes} mins
                    </span>
                  </div>
                  <h2 className="text-xl font-sans font-black text-zinc-100 tracking-tight">
                    {activeTask.chapter}: {activeTask.title}
                  </h2>
                </div>

                {/* Submitting before timer alerts */}
                <div className="text-right">
                  <span className="text-xs text-zinc-500 font-mono block">Status Indicator</span>
                  {user.currentTaskStatus === 'studying' ? (
                    <span className="text-xs text-emerald-400 font-bold tracking-wider uppercase font-mono bg-emerald-950/25 border border-emerald-900/30 px-2 py-0.5 rounded inline-block">
                      🟢 Studying
                    </span>
                  ) : user.currentTaskStatus === 'paused' ? (
                    <span className="text-xs text-amber-500 font-bold tracking-wider uppercase font-mono bg-amber-950/25 border border-amber-900/30 px-2 py-0.5 rounded inline-block">
                      🟠 Paused
                    </span>
                  ) : (
                    <span className="text-xs text-rose-500 font-bold tracking-wider uppercase font-mono bg-rose-950/25 border border-rose-900/30 px-2 py-0.5 rounded inline-block">
                      🔴 Pending
                    </span>
                  )}
                </div>
              </div>

              {/* Assign study time limit slide-control */}
              <div className="bg-zinc-950/80 border border-zinc-850 p-4 rounded-lg space-y-3">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-zinc-400">Assign Focus study hours / duration for this session:</span>
                  <span className="text-cyan-400 font-extrabold font-mono text-xs bg-cyan-950/40 border border-cyan-900/30 px-2 py-0.5 rounded">
                    {Math.round(expectedTimerSeconds / 60)} Mins
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="120"
                  step="5"
                  value={Math.round(expectedTimerSeconds / 60) || 45}
                  onChange={(e) => assignStudyTime(parseInt(e.target.value, 10))}
                  className="w-full h-1 bg-zinc-900 accent-cyan-400 rounded-lg cursor-pointer"
                  title="Assign your custom focus minutes before or during study sessions"
                />
                <div className="flex justify-between text-[8px] text-zinc-600 font-mono">
                  <span>Blitz (5m)</span>
                  <span>Standard Tuition (45m)</span>
                  <span>Deep Marathon (120m)</span>
                </div>
              </div>

              {/* Huge Timer Number */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center bg-zinc-950 p-5 rounded-lg border border-zinc-900">
                <div className="md:col-span-5 text-center md:text-left space-y-1">
                  <h3 className="text-4xl lg:text-5xl font-mono font-black text-cyan-400 tracking-wider">
                    {formatTimer(timerSeconds)}
                  </h3>
                  <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs text-zinc-500">
                    <Clock className="w-3.5 h-3.5 text-zinc-650" />
                    <span>Target: {formatTimer(expectedTimerSeconds)}</span>
                  </div>
                </div>

                {/* Micro Ticking Indicator */}
                <div className="md:col-span-7 space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-zinc-500">Task timer completion index</span>
                    <span className={timerSeconds > expectedTimerSeconds ? "text-red-400 font-bold" : "text-cyan-400 font-bold"}>
                      {progressPercent}% {timerSeconds > expectedTimerSeconds && "(EXCEEDED - Missed bonus)"}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                    <div 
                      className={`h-full transition-all duration-300 rounded-full ${
                        timerSeconds > expectedTimerSeconds 
                          ? "bg-rose-500" 
                          : "bg-gradient-to-r from-cyan-400 to-emerald-400"
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] text-zinc-600 font-mono">
                    Note: Simulated speed runs 30x faster to fit review presentation workflow.
                  </p>
                </div>
              </div>

              {/* Action Buttons Panel */}
              <div className="flex flex-wrap gap-3">
                {user.currentTaskStatus !== 'studying' ? (
                  <button
                    id="timer-start-btn"
                    onClick={startStudyTimer}
                    className="flex-1 sm:flex-initial bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold px-5 py-3 rounded-lg text-sm flex items-center justify-center gap-2 transition-all transition-transform active:scale-95 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-zinc-950" />
                    <span>{user.currentTaskStatus === 'paused' ? "Resume study" : "Start timer"}</span>
                  </button>
                ) : (
                  <button
                    id="timer-pause-btn"
                    onClick={pauseStudyTimer}
                    className="flex-1 sm:flex-initial bg-zinc-800 hover:bg-zinc-750 text-zinc-200 border border-zinc-700 font-bold px-5 py-3 rounded-lg text-sm flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                  >
                    <Pause className="w-4 h-4" />
                    <span>Pause</span>
                  </button>
                )}

                <button
                  id="timer-submit-btn"
                  onClick={submitTask}
                  className="flex-1 sm:flex-initial bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-sans font-black px-5 py-3 rounded-lg text-sm flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Submit homework</span>
                </button>

                <button
                  id="timer-delete-btn"
                  onClick={deleteCurrentTimer}
                  className="bg-zinc-900 hover:bg-red-950/20 text-zinc-500 hover:text-red-400 border border-zinc-850 hover:border-red-900/30 p-3 rounded-lg transition-colors cursor-pointer"
                  title="Abandon active task and forfeit study timer"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>

            </div>
          ) : (
            <div className="py-10 text-center space-y-4">
              <div className="w-14 h-14 bg-zinc-950 border border-zinc-850 text-zinc-600 text-xl font-mono rounded-full flex items-center justify-center mx-auto">
                📚
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="font-sans font-bold text-zinc-200">No active homework selected</h3>
                <p className="text-xs text-zinc-400 leading-normal">
                  You are registered on Hemanth's seat. Click "Select" under any pending subject sheet below to activate the ticking countdown. Kishore and classmate bots will immediately align to compete!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* PENDING CLASS HOMEWORK TASKS */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-zinc-500 uppercase font-bold tracking-widest flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" /> Pending tuition sheets
            </span>
            <span className="text-zinc-600">Pending count: {pendingHomeworkTasks.length}</span>
          </div>

          {pendingHomeworkTasks.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {pendingHomeworkTasks.map((t) => {
                const isSelected = activeTask?.id === t.id;
                let subjColor = "border-cyan-500/10 text-cyan-400 bg-cyan-950/20";
                if (t.subject === "Mathematics") {
                  subjColor = "border-amber-500/10 text-amber-400 bg-amber-950/20";
                } else if (t.subject === "Chemistry") {
                  subjColor = "border-pink-500/10 text-pink-400 bg-pink-950/20";
                }

                return (
                  <div 
                    key={t.id} 
                    id={`task-item-${t.id}`}
                    className={`bg-zinc-900/80 p-4 border rounded-xl flex flex-col justify-between space-y-3 transition-colors ${
                      isSelected ? "border-cyan-400 ring-1 ring-cyan-500/20 bg-zinc-900" : "border-zinc-850 hover:border-zinc-750"
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-start">
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-black tracking-widest ${subjColor}`}>
                          {t.subject}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500">{t.expectedMinutes} mins Limit</span>
                      </div>
                      <h4 className="font-sans font-bold text-zinc-200 text-sm leading-snug">
                        {t.chapter}: {t.title}
                      </h4>
                    </div>

                    <div className="pt-2 border-t border-zinc-950 flex justify-end">
                      <button
                        id={`select-task-btn-${t.id}`}
                        onClick={() => selectTask(t.id)}
                        className={`text-xs font-sans font-bold py-1 px-3.5 rounded transition-all cursor-pointer ${
                          isSelected 
                            ? "bg-cyan-500 text-zinc-950 hover:bg-cyan-400 shadow shadow-cyan-500/10" 
                            : "bg-zinc-950 border border-zinc-800 text-zinc-350 hover:text-white hover:bg-zinc-900 hover:border-cyan-950"
                        }`}
                      >
                        {isSelected ? "Active Focus" : "Select sheet"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-zinc-900/60 p-5 rounded-xl border border-dashed border-zinc-800 text-center">
              <p className="text-xs text-zinc-500">
                Wow! No pending task sheets. Go to the <strong className="text-cyan-400 cursor-pointer" onClick={() => selectTask(tasks[0]?.id)}>Teacher Post</strong> tab to release a new assignment!
              </p>
            </div>
          )}
        </div>

        {/* STUDYING PEERS PROGRESS MONITORS */}
        <div className="bg-zinc-900/70 border border-zinc-850 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-cyan-400" /> Peer Study Monitor
            </span>
            <span className="text-zinc-600">Simulating live progress</span>
          </div>

          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {classmates.map((c) => {
              const isRival = c.role === "rival";
              const isTopper = c.role === "topper";

              let progressColor = "bg-zinc-650";
              if (isRival) progressColor = "bg-red-500 shadow shadow-red-500/10";
              else if (isTopper) progressColor = "bg-yellow-500";
              else if (c.role === "hype") progressColor = "bg-cyan-400";
              else if (c.role === "support") progressColor = "bg-pink-400";

              return (
                <div key={c.id} className="grid grid-cols-12 gap-3 items-center text-xs py-1 border-b border-zinc-950 last:border-0">
                  <div className="col-span-3 flex items-center gap-2">
                    <span className="text-lg shrink-0">{c.avatar}</span>
                    <span className={`font-sans font-bold leading-none truncate ${isRival ? "text-red-400" : "text-zinc-200"}`}>
                      {c.name}
                    </span>
                  </div>
                  <div className="col-span-6 space-y-0.5">
                    <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${progressColor}`}
                        style={{ width: `${c.currentTaskProgress}%` }}
                      ></div>
                    </div>
                    <span className="text-[9px] text-zinc-500 font-mono truncate block max-w-full">
                      {c.statusText}
                    </span>
                  </div>
                  <div className="col-span-3 text-right text-[10px] font-mono font-medium text-zinc-400">
                    {c.currentTaskProgress}% progress
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Chatroom & Real-time Live Leaderboard (40% width on Desktop) */}
      <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-zinc-900 flex flex-col justify-between bg-zinc-950/90 shrink-0">
        
        {/* UPPER: Mini live leaderboard */}
        <div className="p-4 border-b border-zinc-900 space-y-3 bg-zinc-950">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1 text-xs text-zinc-400 font-mono font-bold uppercase tracking-wider">
              <Trophy className="w-4 h-4 text-amber-500" /> Global Leaderboard
            </div>
            <span className="text-[9px] bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono px-2 py-0.5 rounded uppercase font-bold tracking-widest">
              Live updates
            </span>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {leaderboardList.map((ranker, i) => {
              const isMe = ranker.isUser;
              let highlightBg = "bg-zinc-900/40 border-zinc-950 text-zinc-300";
              let medal = "⚪";

              if (i === 0) {
                medal = "🥇";
                highlightBg = "bg-yellow-950/15 border-yellow-900/20 font-bold text-yellow-300";
              } else if (i === 1) {
                medal = "🥈";
                highlightBg = "bg-zinc-900/80 border-zinc-800 text-zinc-200";
              } else if (i === 2) {
                medal = "🥉";
                highlightBg = "bg-amber-950/10 border-amber-900/20 text-amber-400";
              } else if (isMe) {
                highlightBg = "bg-cyan-950/30 border-cyan-800/20 text-cyan-300 ring-1 ring-cyan-500/15";
              }

              return (
                <div 
                  key={ranker.name} 
                  className={`flex items-center justify-between p-2 rounded-lg border text-xs leading-none ${highlightBg}`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-[11px] font-mono text-zinc-500 font-semibold w-4">
                      {i + 1}
                    </span>
                    <span className="shrink-0">{medal} {ranker.avatar}</span>
                    <span className="truncate font-sans font-bold">{ranker.name}</span>
                  </div>
                  <div className="text-right space-y-0.5 shrink-0 font-mono">
                    <span className="font-bold text-[10px] block">{ranker.xp} XP</span>
                    <span className="text-[9px] text-zinc-500 block">{ranker.hours.toFixed(1)}h logged</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MIDDLE: competitive live chatroom messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-64 lg:max-h-[calc(100vh-420px)] bg-zinc-950">
          <p className="text-[9px] text-zinc-650 font-mono uppercase tracking-widest text-center border-b border-zinc-900/60 pb-2 mb-2">
            Classroom Lobby Chat (No giving up!)
          </p>

          <div className="space-y-3.5">
            {messages.map((m) => {
              const isHemanth = m.senderId === "hem-usr";
              const isSys = m.senderId === "sys";
              
              if (isSys) {
                return (
                  <div key={m.id} className="bg-zinc-900 border border-zinc-850/60 rounded p-2 text-center text-[10px] font-mono text-zinc-400 leading-normal">
                    🏫 {m.text}
                  </div>
                );
              }

              let textBubbleClass = "bg-zinc-900 border-zinc-850 text-zinc-300";
              let nameColor = "text-zinc-400";

              if (isHemanth) {
                textBubbleClass = "bg-cyan-950/20 border-cyan-900/40 text-cyan-50";
                nameColor = "text-cyan-400 font-bold";
              } else if (m.senderRole === "rival") {
                textBubbleClass = "bg-red-950/15 border-red-900/20 text-red-50";
                nameColor = "text-red-400 font-bold";
              } else if (m.senderRole === "teacher") {
                textBubbleClass = "bg-emerald-950/15 border-emerald-900/25 text-emerald-100";
                nameColor = "text-emerald-400 font-extrabold";
              } else if (m.senderRole === "hype") {
                textBubbleClass = "bg-cyan-900/10 border-zinc-850 text-cyan-200";
                nameColor = "text-amber-500 font-bold";
              } else if (m.senderRole === "support") {
                textBubbleClass = "bg-zinc-900 border-zinc-850 text-pink-100";
                nameColor = "text-pink-400";
              }

              return (
                <div 
                  key={m.id} 
                  className={`flex gap-2.5 items-start text-xs ${isHemanth ? "flex-row-reverse" : ""}`}
                >
                  <span className="text-xl bg-zinc-900 border border-zinc-800 p-1.5 rounded-lg shrink-0">
                    {m.senderAvatar}
                  </span>
                  <div className="space-y-1 max-w-[78%]">
                    <div className={`flex items-baseline gap-1.5 ${isHemanth ? "justify-end" : ""}`}>
                      <span className={`${nameColor} font-sans text-[11px] truncate`}>
                        {m.senderName}
                      </span>
                      <span className="text-[9px] text-zinc-650 font-mono">{m.timestamp}</span>
                    </div>
                    <div className={`p-2.5 rounded-xl border leading-relaxed ${textBubbleClass}`}>
                      {m.text}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {activeChattingMocker && (
              <div className="flex gap-2.5 items-start text-xs text-zinc-500">
                <span className="text-xl animate-pulse">⚡</span>
                <div className="space-y-1 max-w-[78%]">
                  <span className="font-mono text-[10px] italic">Kishore / classmates are response-typing...</span>
                  <div className="bg-zinc-900 p-2.5 rounded-xl border border-zinc-850 border-dashed italic">
                    typing competitive trash da Hemanth...
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* BOTTOM: Chat input action form */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-900 bg-zinc-950 space-y-2">
          <div className="relative">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder='Type "machi watch me grind" or complain in Tanglish...'
              className="w-full bg-zinc-900 border border-zinc-850 focus:border-cyan-500 text-zinc-100 text-xs rounded-xl pl-3.5 pr-10 py-3 focus:outline-none transition-colors placeholder:text-zinc-600"
            />
            <button
              id="send-msg-btn"
              type="submit"
              className="absolute right-2 top-2 p-1.5 text-cyan-400 hover:text-cyan-300 rounded-lg transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="flex justify-between text-[8px] text-zinc-650 font-mono">
            <span>Example: "dei naa 20 sums mudichiten da"</span>
            <span>Gemini API dynamic character agent</span>
          </div>
        </form>

      </div>

    </div>
  );
};
