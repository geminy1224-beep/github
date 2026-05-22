import React, { useState } from "react";
import { useClassroom } from "../context/ClassroomContext";
import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, RotateCcw, Trash2, ShieldAlert, X } from "lucide-react";

export const SettingsView: React.FC = () => {
  const { clearHistory, user } = useClassroom();
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="w-full h-full overflow-y-auto bg-zinc-950 p-6 relative">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-950/30 border border-red-900/50 flex flex-col items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h1 className="text-2xl font-sans font-black text-white uppercase tracking-wider">
              Danger Zone Settings
            </h1>
            <p className="text-sm text-zinc-500 font-mono tracking-tight">
              Manage local application data and hard resets
            </p>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-red-900/20 rounded-xl overflow-hidden shadow-lg shadow-black/50">
          <div className="p-5 border-b border-zinc-800/50 bg-red-950/10">
            <h2 className="text-lg font-sans font-bold text-red-100 flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-red-400" />
              Reset All Progress
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Warning: This action is irreversible. It will wipe out your current streak, XP, study hours, chat logs, daily reports, and classmate data, restoring everything to a completely fresh state.
            </p>
          </div>
          
          <div className="p-6 bg-zinc-900 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <div className="flex space-x-4 items-center">
                <span className="text-sm text-zinc-300 font-mono">Current Streak:</span>
                <span className="font-bold text-red-400 font-mono">{user.activeStreak} Days</span>
              </div>
              <div className="flex space-x-4 items-center">
                <span className="text-sm text-zinc-300 font-mono">Total Study Time:</span>
                <span className="font-bold text-red-400 font-mono">{user.studyHours}h</span>
              </div>
            </div>

            <button
              onClick={() => setShowConfirm(true)}
              className="w-full bg-red-950 hover:bg-red-900 border border-red-800 text-red-200 font-sans font-bold py-3 px-4 rounded-lg uppercase tracking-wider text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-red-500/10"
            >
              <RotateCcw className="w-4 h-4" />
              Clear Everything & Start Fresh
            </button>
            <p className="text-[10px] text-zinc-500 text-center uppercase tracking-widest font-mono">
              Proceed with extreme caution
            </p>
          </div>
        </div>

      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-zinc-950/90 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-zinc-900 border border-red-900/50 max-w-sm w-full rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center gap-4 relative"
            >
              <div className="w-12 h-12 rounded-full bg-red-950 flex items-center justify-center border border-red-900">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
              
              <div className="space-y-1">
                <h3 className="text-xl font-sans font-black text-white uppercase tracking-wider">Are you sure?</h3>
                <p className="text-xs text-zinc-400">
                  You are about to delete all your study progress. This cannot be undone. Are you absolutely positive?
                </p>
              </div>

              <div className="flex flex-col gap-2 w-full mt-2">
                <button
                  onClick={() => {
                    clearHistory(true);
                    setShowConfirm(false);
                  }}
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-sans font-bold py-3 px-4 rounded-lg uppercase tracking-wider text-xs transition-colors"
                >
                  Yes, Wipe Everything
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-sans font-bold py-3 px-4 rounded-lg uppercase tracking-wider text-xs transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
