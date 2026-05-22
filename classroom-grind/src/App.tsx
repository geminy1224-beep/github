/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ClassroomProvider, useClassroom } from "./context/ClassroomContext";
import { Sidebar } from "./components/Sidebar";
import { LandingPage } from "./components/LandingPage";
import { LoginPage } from "./components/LoginPage";
import { TuitionDesk } from "./components/TuitionDesk";
import { TeacherPost } from "./components/TeacherPost";
import { DailyReport } from "./components/DailyReport";
import { PastLogs } from "./components/PastLogs";
import { WeeklyAnalyticsView } from "./components/WeeklyAnalyticsView";
import { SophiaCorner } from "./components/SophiaCorner";
import { SettingsView } from "./components/SettingsView";
import { BookOpen, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
// @ts-ignore

const MainLayout: React.FC = () => {
  const { 
    activeTab, 
    isJoinedClassroom, 
    sophiaNotification, 
    clearSophiaNotification, 
    setActiveTab,
    isAlivePromptActive,
    clickIAmAlive
  } = useClassroom();

  // Route Views dynamically mapping from active tab
  const renderView = () => {
    switch (activeTab) {
      case "login":
        return <LoginPage />;
      case "landing":
        return <LandingPage />;
      case "dashboard":
        return <TuitionDesk />;
      case "sophia":
        return <SophiaCorner />;
      case "admin":
        return <TeacherPost />;
      case "report":
        return <DailyReport />;
      case "archive":
        return <PastLogs />;
      case "analytics":
        return <WeeklyAnalyticsView />;
      case "settings":
        return <SettingsView />;
      default:
        return <LandingPage />;
    }
  };

  // If the active state is login page, remove sidebar frame entirely for immersive entry
  if (activeTab === "login") {
    return <LoginPage />;
  }

  return (
    <div id="app-viewport-wrapper" className="flex flex-col lg:flex-row min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      
      {/* Sidebar for navigations */}
      <Sidebar />

      {/* Primary interactive view panel */}
      <main id="app-primary-main" className="flex-1 flex flex-col min-h-0 overflow-hidden">
        
        {/* Responsive Mobile Top Navigation alert */}
        <div id="mobile-top-bar" className="lg:hidden flex justify-between items-center px-5 py-4 bg-zinc-950 border-b border-zinc-900 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏫</span>
            <span className="font-sans font-black text-sm text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-cyan-400 uppercase tracking-wider">
              Classroom Grind
            </span>
          </div>
          {isJoinedClassroom && (
            <span className="inline-flex items-center gap-1.5 bg-emerald-950/25 border border-emerald-900/30 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider py-1 px-2.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Group active
            </span>
          )}
        </div>

        {/* Selected route view */}
        <div className="flex-1 flex flex-col min-h-0">
          {renderView()}
        </div>

      </main>

      {/* Sophia caretaker notification popup overlay */}
      <AnimatePresence>
        {sophiaNotification && activeTab !== "sophia" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50, x: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            id="sophia-global-notification"
            className="fixed bottom-6 right-6 z-50 bg-rose-950/95 border-2 border-rose-500/40 p-4 rounded-2xl shadow-2xl shadow-rose-950/40 max-w-sm flex flex-col gap-2.5 backdrop-blur-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-rose-300 font-sans font-bold text-[10px] uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                💖 Friend Care Message
              </div>
              <button 
                onClick={clearSophiaNotification}
                className="text-rose-400 hover:text-rose-200 font-mono text-xs cursor-pointer px-1.5 py-0.5 rounded transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="flex gap-3 items-start">
              <div className="w-10 h-10 rounded-full bg-rose-550/10 border border-rose-500/20 flex items-center justify-center shrink-0 text-xl font-bold">
                💖
              </div>
              <p className="text-xs text-zinc-105 font-sans italic leading-relaxed">
                {sophiaNotification.replace("💖 Sophia: ", "").replace("💖 Friend: ", "")}
              </p>
            </div>
            
            <button
              onClick={() => {
                setActiveTab("sophia");
                clearSophiaNotification();
              }}
              className="w-full bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-mono uppercase font-bold py-2 px-3 rounded-xl text-center transition-all cursor-pointer shadow-md shadow-rose-500/20"
            >
              Respond to Friend ❤️
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desk Alive Check Full-Screen Blocking Takeover */}
      <AnimatePresence>
        {isAlivePromptActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/95 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-zinc-900 border border-cyan-800/40 max-w-md w-full rounded-2xl p-6 shadow-2xl shadow-cyan-950/35 text-center flex flex-col items-center gap-5 relative overflow-hidden"
            >
              {/* Decorative cyan glowing background filters */}
              <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-cyan-400/5 blur-3xl pointer-events-none"></div>

              {/* Glowing Pulse Radar Orb */}
              <div className="relative flex items-center justify-center w-24 h-24 mt-2">
                <span className="absolute animate-ping inline-flex h-20 w-20 rounded-full bg-cyan-400/20 opacity-75"></span>
                <span className="absolute animate-pulse inline-flex h-16 w-16 rounded-full bg-cyan-500/30"></span>
                <div className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-3xl font-bold shadow-lg shadow-cyan-400/25">
                  🤠
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-sans font-black text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-cyan-405 uppercase tracking-wider leading-tight">
                  Are you alive, Hemanth? 🚨
                </h2>
                <p className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase font-bold">
                  ⚠️ Status Check: Standby / Paused
                </p>
              </div>

              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Your study timer has been paused because no desk activity has been confirmed in the last 30 minutes. Prove you are still there to resume your competitive grind and protect your streak!
              </p>

              <button
                type="button"
                id="click-i-am-alive-modal"
                onClick={clickIAmAlive}
                className="w-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-sans font-black uppercase py-3 px-6 rounded-xl text-[11px] tracking-wider transition-all duration-300 transform active:scale-95 shadow-md shadow-cyan-500/25 cursor-pointer flex items-center justify-center gap-2"
              >
                🙋‍♂️ Yes, I am Alive & Grinding!
              </button>

              <div className="text-[9px] text-zinc-600 font-mono uppercase tracking-wider">
                Competitive Lobby: Kishore is study-swatting!
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default function App() {
  return (
    <ClassroomProvider>
      <MainLayout />
    </ClassroomProvider>
  );
}
