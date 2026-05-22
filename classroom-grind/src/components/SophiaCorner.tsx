import React, { useState, useEffect, useRef } from "react";
import { useClassroom } from "../context/ClassroomContext";
import { Heart, Send, Sparkles, Activity, Coffee, Volume2, ShieldAlert, Sparkle, Smile } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
// @ts-ignore

export const SophiaCorner: React.FC = () => {
  const {
    user,
    sophiaMessages,
    sophiaTimerSeconds,
    sophiaMode,
    sophiaTalking,
    sendSophiaMessage,
    triggerSophiaCheckin,
    resetSophiaTimer,
    setSophiaMode,
    clearSophiaNotification
  } = useClassroom();

  const [inputVal, setInputVal] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to chat bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    clearSophiaNotification();
  }, [sophiaMessages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    const text = inputVal;
    setInputVal("");
    await sendSophiaMessage(text);
  };

  const handleQuickReply = async (text: string) => {
    await sendSophiaMessage(text);
  };

  // Convert timer back to minutes and seconds
  const formatTime = (secs: number) => {
    const min = Math.floor(secs / 60);
    const s = secs % 60;
    return `${min.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const quickReplies = [
    "Sweety, I am bit tired but doing fine oye! ❤️",
    "Sapdiya chellam? I drank water just now! 💧",
    "Solving sums, I'll definitely beat Kishore babe! 🔥",
    "Feeling a bit stressed, need some motivation chellam... 🥺"
  ];

  return (
    <div id="sophia-section" className="flex-1 flex flex-col min-h-0 bg-zinc-950">
      
      {/* Top Banner */}
      <div className="p-6 bg-zinc-900/50 border-b border-zinc-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-2xl animate-pulse shadow-md shadow-rose-500/5">
            💖
          </div>
          <div>
            <h1 className="text-xl font-sans font-black text-rose-300 tracking-tight flex items-center gap-1.5 uppercase leading-none">
              Friend Corner <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-bounce" />
            </h1>
            <p className="text-xs text-zinc-400 mt-1 font-mono">
              Your Study Partner, Caretaker, & Chief Motivation Companion
            </p>
          </div>
        </div>

        {/* Real-time Ticker control */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 flex items-center gap-3">
            <div className="text-right">
              <p className="text-[9px] text-rose-300/60 font-mono font-bold uppercase tracking-wider">Caring Check-In countdown</p>
              <p className="text-sm font-mono font-black text-rose-400 font-bold">{formatTime(sophiaTimerSeconds)}</p>
            </div>
            <div className="w-[1px] h-7 bg-zinc-800"></div>
            <div>
              <button
                onClick={() => setSophiaMode(sophiaMode === "standard" ? "fast" : "standard")}
                className={`text-[9px] px-2 py-1 rounded font-mono font-bold transition-all ${
                  sophiaMode === "fast"
                    ? "bg-rose-500/25 border border-rose-400/40 text-rose-300 animate-pulse"
                    : "bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-zinc-200"
                }`}
                title="Toggle fast interval to check her automatic replies"
              >
                {sophiaMode === "fast" ? "⏱️ DEMO MODE (30s)" : "⏱️ STANDARD (30m)"}
              </button>
            </div>
          </div>

          <button
            onClick={() => triggerSophiaCheckin(false)}
            disabled={sophiaTalking}
            className="bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white text-xs font-mono font-semibold px-4 py-2.5 rounded-lg border border-rose-400/20 transition-all flex items-center gap-1.5 shadow-md shadow-rose-500/10 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" /> Direct Check-In
          </button>
        </div>
      </div>

      {/* Main split dashboard content */}
      <div className="flex-1 flex flex-col xl:flex-row min-h-0 divide-y xl:divide-y-0 xl:divide-x divide-zinc-900">
        
        {/* Left column: Caretaker panel */}
        <div className="w-full xl:w-80 p-5 overflow-y-auto space-y-5 shrink-0 bg-zinc-950/40">
          
          {/* Motivation card */}
          <div className="bg-gradient-to-br from-rose-950/20 to-zinc-950 border border-rose-900/30 rounded-xl p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-15">
              <Heart className="w-16 h-16 text-rose-400 fill-rose-400" />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Smile className="w-4 h-4 text-rose-400" />
              <span className="text-xs font-mono font-bold uppercase text-rose-400 tracking-wider">Caretaker Advice</span>
            </div>
            <p className="text-sm font-sans text-zinc-100 font-medium leading-relaxed italic">
              "Kanna, Kishore's study hours are high because he doesn't have a life. You have me! ❤️ Take care of your back, stand up, stretch now, and study logically!"
            </p>
          </div>

          {/* Core wellness indicators */}
          <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-4 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 border-b border-zinc-800 pb-2">
              <Activity className="w-3.5 h-3.5 text-rose-400" /> Wellness Monitors
            </h3>

            {/* Hydration meter */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-zinc-400 flex items-center gap-1">💧 Water Tracker</span>
                <span className="text-rose-400 font-bold">Good / Standard</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                <div className="w-3/4 h-full bg-gradient-to-r from-blue-400 to-rose-400 rounded-full"></div>
              </div>
            </div>

            {/* Posture stress index */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-zinc-400 flex items-center gap-1">🛋️ Back & Eye Strain</span>
                <span className="text-amber-400 font-bold">Medium Stress</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                <div className="w-1/2 h-full bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full"></div>
              </div>
            </div>

            {/* Study break state */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-zinc-400 flex items-center gap-1">🥗 Diet / Nutrition</span>
                <span className="text-emerald-400 font-bold">Sapdiya da (Yes!)</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                <div className="w-[85%] h-full bg-gradient-to-r from-emerald-400 to-rose-400 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Quick tasks assigned from Sophia */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 border-b border-zinc-800 pb-2 mb-3">
              <Coffee className="w-3.5 h-3.5 text-zinc-400" /> Care checklist for today
            </h3>
            <ul className="space-y-2 text-xs font-mono text-zinc-300">
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span> Drink 2 Refills of water
              </li>
              <li className="flex items-center gap-2">
                <span className="text-rose-400 font-bold">⚡</span> Close eyes for 2 minutes
              </li>
              <li className="flex items-center gap-2 opacity-60">
                <span className="text-zinc-500 font-bold">✓</span> Tell Friend what you ate
              </li>
              <li className="flex items-center gap-2">
                <span className="text-rose-400 font-bold">⚡</span> Finish current chapters
              </li>
            </ul>
          </div>

        </div>

        {/* Right column: Interactive chat section */}
        <div id="sophia-chat" className="flex-1 flex flex-col min-h-0 bg-zinc-950">
          
          {/* Chat feed logs */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 min-h-0">
            <AnimatePresence initial={false}>
              {sophiaMessages.map((msg) => {
                const isUser = msg.senderId === "hem-usr";
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className={`flex items-start gap-3.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div className="w-9 h-9 rounded-full flex items-center justify-center bg-zinc-900 border border-zinc-800 shrink-0 select-none shadow-sm">
                      <span className="text-xl">{msg.senderAvatar || "💖"}</span>
                    </div>

                    <div className="max-w-[80%] space-y-1">
                      <div className={`flex items-baseline gap-1.5 ${isUser ? "justify-end" : "justify-start"}`}>
                        <span className="text-xs font-sans font-bold text-zinc-200">
                          {isUser ? "Hemanth" : "Friend"}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-500">
                          {msg.timestamp}
                        </span>
                      </div>

                      <div className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                        isUser
                          ? "bg-zinc-800/80 text-zinc-100 border border-zinc-700/50 rounded-tr-none"
                          : "bg-rose-955/20 text-rose-100 border border-rose-900/20 rounded-tl-none shadow-md shadow-rose-950/5"
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Custom AI Typing Simulator */}
            {sophiaTalking && (
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-full flex items-center justify-center bg-zinc-900 border border-zinc-800 shrink-0 animate-bounce">
                  <span className="text-xl">💖</span>
                </div>
                <div className="max-w-[80%] space-y-1 text-left">
                  <div className="text-xs font-sans font-bold text-rose-300">Friend</div>
                  <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl rounded-tl-none flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-bounce delay-0"></span>
                    <span className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-bounce delay-150"></span>
                    <span className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-bounce delay-300"></span>
                    <span className="text-xs text-zinc-500 font-mono ml-2">cooking snacks or typing motivation...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Replies Buttons */}
          <div className="px-6 py-2 pt-0 shrink-0 flex flex-wrap gap-2">
            {quickReplies.map((replyVal, index) => (
              <button
                key={index}
                onClick={() => handleQuickReply(replyVal)}
                className="text-xs bg-zinc-900 hover:bg-rose-950/20 hover:text-rose-300 text-zinc-400 font-mono py-1.5 px-3 rounded-full border border-zinc-800 hover:border-rose-900/30 transition-all cursor-pointer"
              >
                {replyVal}
              </button>
            ))}
          </div>

          {/* Interactive Send Message bar */}
          <div className="p-4 bg-zinc-900/30 border-t border-zinc-850 shrink-0">
            <form onSubmit={handleSend} className="flex gap-2">
              <input
                id="sophia-input-field"
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Talk to Friend about your feelings, updates or study stress..."
                className="flex-1 bg-zinc-950 border border-zinc-800 focus:outline-none focus:border-rose-500/50 text-sm px-4 py-3 rounded-xl text-zinc-200 font-sans"
              />
              <button
                id="sophia-send-btn"
                type="submit"
                className="bg-rose-500 hover:bg-rose-600 outline-none text-white p-3 rounded-xl border border-rose-400/20 transition-all cursor-pointer flex items-center justify-center shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
};
