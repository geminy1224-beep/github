import React from "react";
import { useClassroom } from "../context/ClassroomContext";
import { 
  Trophy, 
  MessageSquare, 
  User, 
  PlusCircle, 
  BookOpen, 
  Award, 
  Clock, 
  Flame, 
  History, 
  BarChart2, 
  Power,
  Heart,
  Settings
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const { 
    user, 
    isJoinedClassroom, 
    activeTab, 
    setActiveTab, 
    logoutUser, 
    sophiaNotification, 
    generateEndClassReport,
    aliveCheckTimer,
    notificationPermission,
    requestNotificationPermission
  } = useClassroom();

  // Simple game level formula from XP
  const level = Math.floor(user.xp / 400) + 1;
  const nextLevelXP = (level) * 400;
  const currentLevelMinXP = (level - 1) * 400;
  const levelProgress = ((user.xp - currentLevelMinXP) / (nextLevelXP - currentLevelMinXP)) * 100;

  const formatAliveTimer = (sec: number) => {
    const mm = Math.floor(sec / 60);
    const ss = sec % 60;
    return `${mm}:${ss < 10 ? "0" : ""}${ss}`;
  };

  const navItems = [
    { id: "landing", label: "Overview", icon: BookOpen, roleNeeded: "any" },
    { id: "dashboard", label: "Tuition Desk", icon: Trophy, roleNeeded: "joined" },
    { id: "sophia", label: "Friend", icon: Heart, roleNeeded: "any" },
    { id: "admin", label: "Teacher Post", icon: PlusCircle, roleNeeded: "any" },
    { id: "report", label: "Daily Report", icon: Award, roleNeeded: "joined" },
    { id: "archive", label: "Past Logs", icon: History, roleNeeded: "any" },
    { id: "analytics", label: "Weekly Analysis", icon: BarChart2, roleNeeded: "any" },
    { id: "settings", label: "Settings", icon: Settings, roleNeeded: "any" },
  ];

  return (
    <div id="classroom-sidebar" className="w-full lg:w-76 bg-zinc-950 border-b lg:border-b-0 lg:border-r border-zinc-800 flex flex-col justify-between shrink-0 select-none">
      
      {/* Client Frame / Profile section */}
      <div>
        <div className="p-5 border-b border-zinc-900 flex flex-col items-center text-center">
          <div className="relative">
            <div className="w-18 h-18 rounded-full bg-gradient-to-tr from-cyan-500 via-emerald-400 to-indigo-600 p-[3px] shadow-lg shadow-cyan-500/10">
              <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center text-3xl">
                🤠
              </div>
            </div>
            {isJoinedClassroom && (
              <span className="absolute bottom-1 right-1 flex h-4.5 w-4.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4.5 w-4.5 bg-emerald-500 border-2 border-zinc-900"></span>
              </span>
            )}
          </div>

          <h3 className="mt-3 text-lg font-sans font-bold text-zinc-100 tracking-tight flex items-center gap-1.5 leading-none">
            {user.name} 
            <span className="text-[10px] bg-cyan-500/15 border border-cyan-400/20 text-cyan-400 font-mono py-0.5 px-2 rounded-sm uppercase tracking-wider">
              Student
            </span>
          </h3>
          <p className="text-xs text-zinc-500 mt-1 font-mono">Rank: #6 Tuition Class</p>

          {/* Gaming XP bar */}
          <div className="w-full mt-5 bg-zinc-900 border border-zinc-800 rounded-md p-2.5">
            <div className="flex justify-between items-center text-[10px] font-mono font-medium mb-1">
              <span className="text-zinc-400">LVL {level}</span>
              <span className="text-zinc-500">{user.xp} / {nextLevelXP} XP</span>
            </div>
            <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-900">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${levelProgress}%` }}
              ></div>
            </div>
          </div>

          {/* Active Alive Check indicator */}
          {user.currentTaskStatus === 'studying' && (
            <div className="w-full mt-3.5 bg-cyan-950/20 border border-cyan-800/30 rounded-lg p-2.5 flex flex-col gap-1.5 text-left">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-cyan-300 font-mono uppercase tracking-wider font-bold">
                  Desk Surveillance
                </span>
                <span className="text-[11px] font-mono font-black text-cyan-400 animate-pulse">
                  {formatAliveTimer(aliveCheckTimer)}
                </span>
              </div>
              <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-cyan-400 rounded-full transition-all duration-1000"
                  style={{ width: `${(aliveCheckTimer / 1800) * 100}%` }}
                ></div>
              </div>
              <p className="text-[9px] text-zinc-500 font-sans leading-normal">
                Desk check-in pauses daily timer to prevent offline cheating.
              </p>
              {notificationPermission !== "granted" && (
                <button
                  type="button"
                  onClick={requestNotificationPermission}
                  className="w-full bg-cyan-900/40 hover:bg-cyan-800/50 text-cyan-350 text-[9px] font-mono font-bold uppercase py-1 px-1.5 rounded border border-cyan-800/30 transition-all cursor-pointer text-center"
                >
                  🔔 Enable Push Alerts
                </button>
              )}
            </div>
          )}
        </div>

        {/* Live stats highlights */}
        <div className="grid grid-cols-2 border-b border-zinc-900 divide-x divide-zinc-900">
          <div className="p-3 text-center flex flex-col items-center">
            <div className="flex items-center gap-1 text-zinc-400 text-[10px] font-mono font-semibold uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5 text-cyan-400" /> Study Hours
            </div>
            <div className="text-lg font-sans font-black text-cyan-400 mt-0.5">{user.studyHours.toFixed(1)}h</div>
            <div className="text-[9px] text-zinc-500 font-mono">Target: {user.dailyTargetHours}h</div>
          </div>
          <div className="p-3 text-center flex flex-col items-center">
            <div className="flex items-center gap-1 text-zinc-400 text-[10px] font-mono font-semibold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> Daily Streak
            </div>
            <div className="text-lg font-sans font-black text-amber-500 mt-0.5">{user.activeStreak} Days</div>
            <div className="text-[9px] text-zinc-500 font-mono">Consistency Fire</div>
          </div>
        </div>

        {/* Navigation Area */}
        <div className="p-3 space-y-1">
          <p className="text-[10px] text-zinc-600 font-mono font-black uppercase tracking-widest pl-2 mb-2">Classroom Navigation</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isTabActive = activeTab === item.id;
            const isLocked = item.roleNeeded === "joined" && !isJoinedClassroom;

            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                disabled={isLocked}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-left transition-all duration-200 ${
                  isTabActive 
                    ? "bg-zinc-900 border border-zinc-800 text-cyan-400 font-medium" 
                    : isLocked 
                      ? "text-zinc-700 cursor-not-allowed opacity-40" 
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isTabActive ? "text-cyan-400" : "text-zinc-500"}`} />
                  <span className="text-sm">{item.label}</span>
                </div>
                {item.id === "dashboard" && isJoinedClassroom && (
                  <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
                )}
                {item.id === "sophia" && sophiaNotification && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Area with leave classroom and log out status */}
      <div className="p-4 border-t border-zinc-900 flex flex-col gap-2.5">
        {isJoinedClassroom && (
          <div className="bg-cyan-950/20 border border-cyan-800/20 rounded-md py-2 px-3 flex gap-2 items-center">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
            <span className="text-[10px] text-cyan-300 font-mono uppercase tracking-wider font-semibold">
              Live in Online Tuition Lobby
            </span>
          </div>
        )}
        <button
          id="logout-btn"
          onClick={logoutUser}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-zinc-500 hover:text-rose-400 rounded-md text-left text-xs font-mono transition-colors"
        >
          <Power className="w-4 h-4" />
          <span>Exit Account Portal</span>
        </button>
      </div>

    </div>
  );
};
