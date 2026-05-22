import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { Task, Classmate, Message, ClassReport, WeeklyAnalytics, ClassmateRole } from "../types";

// Define the shape of our context
interface ClassroomContextType {
  user: {
    name: string;
    xp: number;
    studyHours: number;
    dailyTargetHours: number;
    currentTaskStatus: 'idle' | 'studying' | 'paused';
    activeStreak: number;
  };
  classmates: Classmate[];
  tasks: Task[];
  activeTask: Task | null;
  messages: Message[];
  reports: ClassReport[];
  weeklyAnalytics: WeeklyAnalytics;
  isJoinedClassroom: boolean;
  activeTab: string;
  timerSeconds: number;
  expectedTimerSeconds: number;
  activeChattingMocker: boolean;
  classroomStatus: string;
  loginUser: (name: string, targetHours: number) => void;
  logoutUser: () => void;
  joinClassroom: () => void;
  leaveClassroom: () => void;
  setActiveTab: (tab: string) => void;
  addTask: (subject: string, chapter: string, title: string, expectedMinutes: number) => void;
  deleteTask: (taskId: string) => void;
  selectTask: (taskId: string) => void;
  startStudyTimer: () => void;
  pauseStudyTimer: () => void;
  resumeStudyTimer: () => void;
  submitTask: () => void;
  deleteCurrentTimer: () => void;
  sendUserMessage: (text: string) => Promise<void>;
  generateEndClassReport: () => void;
  simulateClassmateActivity: () => void;
  clearHistory: () => void;
  // Sophia (Girlfriend / Caretaker) States & Metods
  sophiaMessages: Message[];
  sophiaTimerSeconds: number;
  sophiaMode: 'standard' | 'fast';
  sophiaTalking: boolean;
  sophiaNotification: string | null;
  sendSophiaMessage: (text: string) => Promise<void>;
  triggerSophiaCheckin: (isAuto?: boolean) => Promise<void>;
  resetSophiaTimer: (mode?: 'standard' | 'fast') => void;
  setSophiaMode: (mode: 'standard' | 'fast') => void;
  clearSophiaNotification: () => void;
  assignStudyTime: (minutes: number) => void;
  startNewDayReset: () => void;
  boostCompetitors: () => void;
  fastForwardTimer: (minutes: number) => void;
  // Background Alive Check States
  aliveCheckTimer: number;
  isAlivePromptActive: boolean;
  notificationPermission: string;
  clickIAmAlive: () => void;
  requestNotificationPermission: () => void;
}

const ClassroomContext = createContext<ClassroomContextType | undefined>(undefined);

// Core initial constants for the simulation
const INITIAL_CLASSMATES: Classmate[] = [
  { id: "1", name: "Kishore", avatar: "⚡", role: "rival", xp: 220, studyHours: 2.1, statusText: "grinding 20 sums, almost done da 😏", currentTaskProgress: 25, completedTasksCount: 1 },
  { id: "2", name: "Rayyan", avatar: "🎯", role: "topper", xp: 190, studyHours: 1.8, statusText: "Analyzing HC Verma Physics problems.", currentTaskProgress: 20, completedTasksCount: 1 },
  { id: "3", name: "Guru", avatar: "📚", role: "topper", xp: 160, studyHours: 1.5, statusText: "solving integration worksheet chapter-3", currentTaskProgress: 15, completedTasksCount: 0 },
  { id: "4", name: "Azzez", avatar: "🔬", role: "topper", xp: 130, studyHours: 1.2, statusText: "organizing organic chemistry formulas", currentTaskProgress: 10, completedTasksCount: 0 },
  { id: "5", name: "Guna", avatar: "✏️", role: "topper", xp: 100, studyHours: 0.9, statusText: "memorizing chemical reactions", currentTaskProgress: 5, completedTasksCount: 0 },
  { id: "6", name: "Sameer", avatar: "🌸", role: "support", xp: 75, studyHours: 0.6, statusText: "doing formulas slow & clean, all the best!", currentTaskProgress: 5, completedTasksCount: 0 },
  { id: "7", name: "Aakash", avatar: "🚀", role: "hype", xp: 50, studyHours: 0.3, statusText: "Comeback arc loading da machi! 😤⚡", currentTaskProgress: 0, completedTasksCount: 0 }
];

const INITIAL_TASKS: Task[] = [];

const INITIAL_MESSAGES: Message[] = [
  { id: "m1", senderId: "1", senderName: "Kishore", senderRole: "rival", senderAvatar: "⚡", text: "dei naa 20 sums mudichiten da 😭🔥 are you boys still slacking??", timestamp: "18:30" },
  { id: "m2", senderId: "7", senderName: "Aakash", senderRole: "hype", senderAvatar: "🚀", text: "Kishore, reel suthadha da! Oru sum-naalum perfect ah step pottiya? 😂", timestamp: "18:31" },
  { id: "m3", senderId: "3", senderName: "Guru", senderRole: "topper", senderAvatar: "📚", text: "Gauss Law derivation is highly technical. Focus guys, Maveeran Sir board-la check pannuvaaru.", timestamp: "18:33" },
  { id: "m4", senderId: "6", senderName: "Sameer", senderRole: "support", senderAvatar: "🌸", text: "Hemanth is starting from 0.0 hours today. Keep grinding machi! You need to cross everyone!", timestamp: "18:35" },
  { id: "m5", senderId: "1", senderName: "Kishore", senderRole: "rival", senderAvatar: "⚡", text: "Sabba! Kishore already submit pannitan ☠️ Hemanth timer set panna easy da, mudikka dhan kashtam 😏", timestamp: "18:40" }
];

const INITIAL_REPORTS: ClassReport[] = [
  {
    id: "rep-1",
    date: "May 21, 2026",
    studyHours: 7.2,
    xpEarned: 180,
    tasksCompleted: 3,
    missedTimers: 1,
    fastestSubmission: "Electrostatics derivation in 18 mins",
    rankMovement: "Overtook Guru (+1 Rank)",
    rank: 6,
    teacherRemarks: "Maveeran Sir says: \"Good derivations, Hemanth! But why did you miss the Vector timer? Absolute discipline is the target!\"",
    friendReactions: [
      "Kishore: 'Paravala oye, 7 hours update pannita. Next test-la unna thookuren! 😏'",
      "Aakash: 'Mass machi! Badges collected is stellar. Keep pushing!'",
      "Sameer: 'Extremely proud of you Hemanth. Step-by-step progress dhaan correct.'"
    ],
    badges: ["Fastest Finisher", "Comeback Player"],
    leaderboardSnapshot: [
      { name: "Kishore", xp: 1530, rank: 1 },
      { name: "Rayyan", xp: 1490, rank: 2 },
      { name: "Guru", xp: 1410, rank: 3 },
      { name: "Azzez", xp: 1310, rank: 4 },
      { name: "Guna", xp: 1260, rank: 5 },
      { name: "Hemanth (You)", xp: 1200, rank: 6 },
      { name: "Sameer", xp: 1140, rank: 7 },
      { name: "Aakash", xp: 1080, rank: 8 }
    ]
  },
  {
    id: "rep-2",
    date: "May 20, 2026",
    studyHours: 8.5,
    xpEarned: 240,
    tasksCompleted: 4,
    missedTimers: 0,
    fastestSubmission: "Nomenclature list in 12 mins",
    rankMovement: "Rank maintained at 6th",
    rank: 6,
    teacherRemarks: "Maths Miss says: \"Speed and integrations are commendable today. Solve 50 worksheets next class for a total comeback.\"",
    friendReactions: [
      "Kishore: 'Nee 8 hours study panna enna, Kishore target 10 yesterday da kanna! 😜'",
      "Aakash: 'Absolute fire da! 9 hour targets match panna aduthadhu! 🚀'",
      "Sameer: 'Solid calm run. Very consistent.'"
    ],
    badges: ["Most Consistent", "Speedy Gonzales"],
    leaderboardSnapshot: [
      { name: "Kishore", xp: 1480, rank: 1 },
      { name: "Rayyan", xp: 1440, rank: 2 },
      { name: "Guru", xp: 1390, rank: 3 },
      { name: "Azzez", xp: 1290, rank: 4 },
      { name: "Guna", xp: 1240, rank: 5 },
      { name: "Hemanth (You)", xp: 1100, rank: 6 },
      { name: "Sameer", xp: 1090, rank: 7 },
      { name: "Aakash", xp: 1020, rank: 8 }
    ]
  }
];

const INITIAL_SOPHIA_MESSAGES: Message[] = [
  {
    id: "sophia-init",
    senderId: "sophia",
    senderName: "Friend",
    senderRole: "support",
    senderAvatar: "💖",
    text: "Hey, study bro/grind machi! 😘 Just checking on you, my hardworking champion. Are you taking care of yourself and drinking enough water oye? How are Hemanth's updates and feelings? Tell me everything sweetie! Let's beat Kishore together!",
    timestamp: "18:30"
  }
];

export const ClassroomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states from localStorage if available
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("grind_user");
    return saved ? JSON.parse(saved) : {
      name: "Hemanth",
      xp: 0,
      studyHours: 0.0,
      dailyTargetHours: 12,
      currentTaskStatus: 'idle' as 'idle' | 'studying' | 'paused',
      activeStreak: 1
    };
  });

  const [classmates, setClassmates] = useState<Classmate[]>(() => {
    const saved = localStorage.getItem("grind_classmates");
    return saved ? JSON.parse(saved) : INITIAL_CLASSMATES;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("grind_tasks");
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [activeTask, setActiveTask] = useState<Task | null>(() => {
    const saved = localStorage.getItem("grind_active_task");
    return saved ? JSON.parse(saved) : null;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("grind_messages");
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [reports, setReports] = useState<ClassReport[]>(() => {
    const saved = localStorage.getItem("grind_reports");
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const [isJoinedClassroom, setIsJoinedClassroom] = useState(() => {
    return localStorage.getItem("grind_joined") === "true";
  });

  const [activeTab, setActiveTabState] = useState(() => {
    return localStorage.getItem("grind_active_tab") || "landing";
  });

  // Timer states
  const [timerSeconds, setTimerSeconds] = useState(() => {
    const saved = localStorage.getItem("grind_timer_seconds");
    return saved ? parseInt(saved, 10) : 0;
  });

  // Store the target time for study
  const [expectedTimerSeconds, setExpectedTimerSeconds] = useState(() => {
    const saved = localStorage.getItem("grind_expected_seconds");
    return saved ? parseInt(saved, 10) : 0;
  });

  // Sophia States
  const [sophiaMessages, setSophiaMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("grind_sophia_messages");
    return saved ? JSON.parse(saved) : INITIAL_SOPHIA_MESSAGES;
  });

  const [sophiaTimerSeconds, setSophiaTimerSeconds] = useState(() => {
    const saved = localStorage.getItem("grind_sophia_timer");
    return saved ? parseInt(saved, 10) : 1800; // 30 minutes
  });

  const [sophiaMode, setSophiaModeState] = useState<'standard' | 'fast'>(() => {
    const saved = localStorage.getItem("grind_sophia_mode");
    return (saved === "standard" || saved === "fast") ? saved : "standard";
  });

  const [sophiaTalking, setSophiaTalking] = useState(false);
  const [sophiaNotification, setSophiaNotification] = useState<string | null>(null);

  // Background Alive Check States
  const [aliveCheckTimer, setAliveCheckTimer] = useState<number>(() => {
    const saved = localStorage.getItem("grind_alive_check_timer");
    return saved ? parseInt(saved, 10) : 1800; // 30 minutes (1800 seconds)
  });

  const [isAlivePromptActive, setIsAlivePromptActive] = useState<boolean>(() => {
    return localStorage.getItem("grind_alive_prompt_active") === "true";
  });

  const [notificationPermission, setNotificationPermission] = useState<string>(() => {
    if (typeof Notification !== "undefined") {
      return Notification.permission;
    }
    return "default";
  });

  const triggerAliveDesktopNotification = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 frequency tone
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.35);
    } catch (e) {
      console.warn("Audio Context beep error active:", e);
    }

    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      new Notification("🚨 STUDY SURVEILLANCE: ARE YOU ALIVE?", {
        body: "Prove you are still grinding or study timer will pause automatically!",
        requireInteraction: true,
        tag: "grind-alive-badge",
      });
    }
  };

  const clickIAmAlive = () => {
    setIsAlivePromptActive(false);
    setAliveCheckTimer(1800);
    localStorage.setItem("grind_alive_check_timer", "1800");
    localStorage.setItem("grind_alive_prompt_active", "false");

    setUser(prev => ({
      ...prev,
      currentTaskStatus: 'studying'
    }));

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [
      ...prev,
      {
        id: `m-alive-${Date.now()}`,
        senderId: "hem-usr",
        senderName: "Hemanth (You)",
        senderRole: "hype",
        senderAvatar: "🤠",
        text: "Machi, I am alive and grinding! Focus is 100% on this topic! 🚀📈",
        timestamp
      }
    ]);

    setClassroomStatus("Surveillance check passed! Resuming study timer...");
  };

  const requestNotificationPermission = async () => {
    if (typeof Notification === "undefined") return;
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    } catch (err) {
      console.error("Failed requesting Notification status:", err);
    }
  };

  const [classroomStatus, setClassroomStatus] = useState("Lobby is chilling. Kishore is teasing Guna.");
  const [activeChattingMocker, setActiveChattingMocker] = useState(false);

  // Interval reference for study timer
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  // Interval reference for classmates' simulation
  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem("grind_user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem("grind_classmates", JSON.stringify(classmates));
  }, [classmates]);

  useEffect(() => {
    localStorage.setItem("grind_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("grind_active_task", activeTask ? JSON.stringify(activeTask) : "");
  }, [activeTask]);

  useEffect(() => {
    localStorage.setItem("grind_messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("grind_reports", JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem("grind_joined", isJoinedClassroom ? "true" : "false");
  }, [isJoinedClassroom]);

  useEffect(() => {
    localStorage.setItem("grind_active_tab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem("grind_timer_seconds", timerSeconds.toString());
  }, [timerSeconds]);

  useEffect(() => {
    localStorage.setItem("grind_expected_seconds", expectedTimerSeconds.toString());
  }, [expectedTimerSeconds]);

  useEffect(() => {
    localStorage.setItem("grind_sophia_messages", JSON.stringify(sophiaMessages));
  }, [sophiaMessages]);

  useEffect(() => {
    localStorage.setItem("grind_sophia_timer", sophiaTimerSeconds.toString());
  }, [sophiaTimerSeconds]);

  useEffect(() => {
    localStorage.setItem("grind_sophia_mode", sophiaMode);
  }, [sophiaMode]);

  useEffect(() => {
    localStorage.setItem("grind_alive_check_timer", aliveCheckTimer.toString());
  }, [aliveCheckTimer]);

  useEffect(() => {
    localStorage.setItem("grind_alive_prompt_active", isAlivePromptActive ? "true" : "false");
  }, [isAlivePromptActive]);

  // Dynamic references to safeguard clean async API scopes
  const sophiaMessagesRef = useRef(sophiaMessages);
  useEffect(() => {
    sophiaMessagesRef.current = sophiaMessages;
  }, [sophiaMessages]);

  const userRef = useRef(user);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const tasksRef = useRef(tasks);
  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  const classmatesRef = useRef(classmates);
  useEffect(() => {
    classmatesRef.current = classmates;
  }, [classmates]);

  const reportsRef = useRef(reports);
  useEffect(() => {
    reportsRef.current = reports;
  }, [reports]);

  // One-time auto-reset to set Hemanth to 0 points / studyHours to earn from scratch
  useEffect(() => {
    const isReset = localStorage.getItem("grind_hemanth_scratch_v5");
    if (!isReset) {
      setUser({
        name: "Hemanth",
        xp: 0,
        studyHours: 0.0,
        dailyTargetHours: 12,
        currentTaskStatus: 'idle' as 'idle' | 'studying' | 'paused',
        activeStreak: 1
      });
      setClassmates([
        { id: "1", name: "Kishore", avatar: "⚡", role: "rival", xp: 220, studyHours: 2.1, statusText: "grinding 20 sums, almost done da 😏", currentTaskProgress: 25, completedTasksCount: 1 },
        { id: "2", name: "Rayyan", avatar: "🎯", role: "topper", xp: 190, studyHours: 1.8, statusText: "Analyzing HC Verma Physics problems.", currentTaskProgress: 20, completedTasksCount: 1 },
        { id: "3", name: "Guru", avatar: "📚", role: "topper", xp: 160, studyHours: 1.5, statusText: "solving integration worksheet chapter-3", currentTaskProgress: 15, completedTasksCount: 0 },
        { id: "4", name: "Azzez", avatar: "🔬", role: "topper", xp: 130, studyHours: 1.2, statusText: "organizing organic chemistry formulas", currentTaskProgress: 10, completedTasksCount: 0 },
        { id: "5", name: "Guna", avatar: "✏️", role: "topper", xp: 100, studyHours: 0.9, statusText: "memorizing chemical reactions", currentTaskProgress: 5, completedTasksCount: 0 },
        { id: "6", name: "Sameer", avatar: "🌸", role: "support", xp: 75, studyHours: 0.6, statusText: "doing formulas slow & clean, all the best!", currentTaskProgress: 5, completedTasksCount: 0 },
        { id: "7", name: "Aakash", avatar: "🚀", role: "hype", xp: 50, studyHours: 0.3, statusText: "Comeback arc loading da machi! 😤⚡", currentTaskProgress: 0, completedTasksCount: 0 }
      ]);
      setTasks([]);
      setActiveTask(null);
      setTimerSeconds(0);
      setExpectedTimerSeconds(0);
      setSophiaMessages(INITIAL_SOPHIA_MESSAGES);
      setReports(INITIAL_REPORTS);
      localStorage.setItem("grind_hemanth_scratch_v5", "true");
    }
  }, []);

  // Recover elapsed study time while site was closed with Alive Check boundaries
  useEffect(() => {
    const savedUserStr = localStorage.getItem("grind_user");
    if (savedUserStr) {
      try {
        const parsedUser = JSON.parse(savedUserStr);
        if (parsedUser.currentTaskStatus === 'studying') {
          const lastTick = localStorage.getItem("grind_last_tick");
          if (lastTick) {
            const elapsedMs = Date.now() - parseInt(lastTick, 10);
            const elapsedSecs = Math.floor(elapsedMs / 1000);
            if (elapsedSecs > 0) {
              const savedAliveTimer = parseInt(localStorage.getItem("grind_alive_check_timer") || "1800", 10);
              let actualCreditedSecs = elapsedSecs;
              let triggeredCheck = false;

              if (elapsedSecs >= savedAliveTimer) {
                // They crossed the Alive Check deadline while offline! Max out credit at the deadline checkpoint.
                actualCreditedSecs = savedAliveTimer;
                triggeredCheck = true;
              }

              const remainingAlive = triggeredCheck ? 1800 : (savedAliveTimer - elapsedSecs);
              setAliveCheckTimer(remainingAlive);

              if (triggeredCheck) {
                setIsAlivePromptActive(true);
              }

              if (actualCreditedSecs > 0) {
                setTimerSeconds(prev => prev + actualCreditedSecs);

                const addedHours = actualCreditedSecs / 3600;
                const focusXPReward = Math.floor(actualCreditedSecs / 60) * 2;

                setUser(prev => ({
                  ...prev,
                  studyHours: parseFloat((prev.studyHours + addedHours).toFixed(6)),
                  xp: prev.xp + focusXPReward,
                  currentTaskStatus: triggeredCheck ? 'paused' : prev.currentTaskStatus
                }));

                const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                setMessages(prev => [
                  ...prev,
                  {
                    id: `sys-resume-${Date.now()}`,
                    senderId: "sys",
                    senderName: "Classroom System",
                    senderRole: "teacher",
                    senderAvatar: "🏫",
                    text: triggeredCheck
                      ? `Welcome back, Hemanth! Re-synced ${Math.floor(actualCreditedSecs / 60)} mins of study time. Hit the "I am Alive" prompt to resume!`
                      : `Welcome back, Hemanth! Re-synced ${Math.floor(actualCreditedSecs / 60)} mins of offline study time!`,
                    timestamp
                  }
                ]);
              }
            }
          }
        }
      } catch (err) {
        console.error("Failed to recover study timer:", err);
      }
    }
  }, []);

  // Sophia automatic check-in executioner
  const triggerSophiaCheckin = async (isAuto = false) => {
    setSophiaTalking(true);
    try {
      const response = await fetch("/api/sophia/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_input: "",
          is_auto_checkin: isAuto,
          user_study_hours: userRef.current.studyHours,
          user_xp: userRef.current.xp,
          chat_history: sophiaMessagesRef.current
        })
      });

      if (response.ok) {
        const data = await response.json();
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newMsg: Message = {
          id: `sophia-${Date.now()}`,
          senderId: "sophia",
          senderName: "Friend",
          senderRole: "support",
          senderAvatar: "💖",
          text: data.text,
          timestamp
        };
        setSophiaMessages(prev => [...prev, newMsg]);

        if (isAuto) {
          setSophiaNotification(`💖 Friend: "${data.text.slice(0, 50)}..."`);
        }
      }
    } catch (e) {
      console.error("Sophia check-in failed:", e);
    } finally {
      setSophiaTalking(false);
    }
  };

  // Background ticker for Sophia's updates
  useEffect(() => {
    if (activeTab === "login") return;

    const interval = setInterval(() => {
      setSophiaTimerSeconds(prev => {
        if (prev <= 1) {
          triggerSophiaCheckin(true);
          return sophiaMode === "fast" ? 30 : 1800;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTab, sophiaMode]);

  // Keep track of active study timer ticking with integrated Alive Check monitoring
  useEffect(() => {
    if (user.currentTaskStatus === 'studying') {
      timerIntervalRef.current = setInterval(() => {
        localStorage.setItem("grind_last_tick", Date.now().toString());

        // Decrement alive check timer first
        setAliveCheckTimer(prev => {
          if (prev <= 1) {
            // Trigger the Alive Check warning! Show modal and play alert sound
            setIsAlivePromptActive(true);
            triggerAliveDesktopNotification();

            // Auto-pause study timer immediately
            setUser(u => ({ ...u, currentTaskStatus: 'paused' }));

            return 1800; // Reset countdown for the next cycle
          }
          return prev - 1;
        });

        setTimerSeconds(prev => {
          const updated = prev + 1;
          // Real data calculation:
          // 1 real second of study increments studyHours by exactly 1/3600 of an hour.
          // Award +2 XP focus reward for every 1 full minute (60 seconds) under study.
          const focusXPReward = (updated % 60 === 0) ? 2 : 0;
          setUser(u => ({
            ...u,
            studyHours: parseFloat((u.studyHours + (1 / 3600)).toFixed(6)),
            xp: u.xp + focusXPReward
          }));
          return updated;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [user.currentTaskStatus]);

  // Handle peer pressure classmate simulation triggers
  useEffect(() => {
    if (user.currentTaskStatus === 'studying' && activeTask) {
      simulationIntervalRef.current = setInterval(() => {
        simulateClassmateActivity();
      }, 8000); // simulation heartbeat every 8 seconds
    } else {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
      }
    }

    return () => {
      if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
    };
  }, [user.currentTaskStatus, activeTask, classmates]);

  // Safe tab switcher
  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
  };

  // Login handler
  const loginUser = (name: string, targetHours: number) => {
    setUser(prev => ({
      ...prev,
      name: name || "Hemanth",
      dailyTargetHours: targetHours || 9
    }));
    setActiveTab("landing");
  };

  const logoutUser = () => {
    setUser({
      name: "Hemanth",
      xp: 0,
      studyHours: 0.0,
      dailyTargetHours: 12,
      currentTaskStatus: 'idle',
      activeStreak: 1
    });
    setClassmates(INITIAL_CLASSMATES);
    setTasks(INITIAL_TASKS);
    setActiveTask(null);
    setMessages(INITIAL_MESSAGES);
    setReports(INITIAL_REPORTS);
    setIsJoinedClassroom(false);
    setTimerSeconds(0);
    setExpectedTimerSeconds(0);
    setSophiaMessages(INITIAL_SOPHIA_MESSAGES);
    setSophiaTimerSeconds(1800);
    setSophiaModeState("standard");
    setSophiaTalking(false);
    setSophiaNotification(null);
    setActiveTab("login");
  };

  const joinClassroom = () => {
    setIsJoinedClassroom(true);
    setClassroomStatus("Lobby connected. Classroom energy is highly intense!");
    // Trigger an initial greet to the student
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const welcomeMsgs: Message[] = [
      {
        id: "sys-" + Date.now(),
        senderId: "sys",
        senderName: "Classroom System",
        senderRole: "teacher",
        senderAvatar: "🏫",
        text: `Hemanth ${user.name !== 'Hemanth' ? `(${user.name})` : ''} has entered the competitive workspace! Current rank: 6th.`,
        timestamp
      }
    ];
    setMessages(prev => [...prev].concat(welcomeMsgs));
    setActiveTab("dashboard");
  };

  const leaveClassroom = () => {
    setIsJoinedClassroom(false);
    setClassroomStatus("Lobby offline.");
    setActiveTab("landing");
  };

  // Admin: add task
  const addTask = (subject: string, chapter: string, title: string, expectedMinutes: number) => {
    const newTask: Task = {
      id: "t-" + Date.now(),
      subject,
      chapter,
      title,
      expectedMinutes,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [newTask, ...prev]);

    // Send a mock teacher announcement message in the chat!
    let teacherSender = "Maveeran Sir";
    let teacherAvatar = "👺";
    if (subject === "Mathematics") {
      teacherSender = "Maths Miss";
      teacherAvatar = "📐";
    } else if (subject === "Chemistry") {
      teacherSender = "Chemistry Miss";
      teacherAvatar = "🧪";
    }

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [
      ...prev,
      {
        id: "msg-" + Date.now(),
        senderId: "teach-" + Date.now(),
        senderName: teacherSender,
        senderRole: "teacher",
        senderAvatar: teacherAvatar,
        text: `🚨 NEW GRIND POSTED in ${subject}: "${title}" (${expectedMinutes} mins limit). Solve immediately with absolute precision!`,
        timestamp
      }
    ]);
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    if (activeTask && activeTask.id === taskId) {
      setActiveTask(null);
      setTimerSeconds(0);
      setExpectedTimerSeconds(0);
    }
  };

  const selectTask = (taskId: string) => {
    const matched = tasks.find(t => t.id === taskId);
    if (matched) {
      setActiveTask(matched);
      setTimerSeconds(0);
      setExpectedTimerSeconds(matched.expectedMinutes * 60);

      // Reset classmates task progress
      setClassmates(prev => prev.map(c => {
        if (c.role === "rival") {
          return { ...c, currentTaskProgress: 25, statusText: "Rival Kishore analyzing user started task..." };
        }
        if (c.role === "topper") {
          return { ...c, currentTaskProgress: 18, statusText: "Rayyan solving derivations smoothly." };
        }
        return { ...c, currentTaskProgress: 0, statusText: "Setting target tools" };
      }));

      // Trigger server reaction for task started!
      triggerServerReaction("task_start", `Task Selected: ${matched.subject} - ${matched.title}. Expected: ${matched.expectedMinutes} mins.`, matched);
    }
  };

  // Timer controls
  const startStudyTimer = () => {
    setUser(prev => ({ ...prev, currentTaskStatus: 'studying' }));
    setClassroomStatus("Active study tracker running. Focus state activated!");
  };

  const pauseStudyTimer = () => {
    setUser(prev => ({ ...prev, currentTaskStatus: 'paused' }));
    setClassroomStatus("Study tracker paused.");
  };

  const resumeStudyTimer = () => {
    setUser(prev => ({ ...prev, currentTaskStatus: 'studying' }));
    setClassroomStatus("Resumed study focus.");
  };

  // Helper to request API responses from the Server for conversational immersion
  const triggerServerReaction = async (actionType: string, textInput: string, currentTaskObject: any) => {
    setActiveChattingMocker(true);
    try {
      const response = await fetch("/api/classroom/respond", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          action_type: actionType,
          user_input: textInput,
          task_details: currentTaskObject ? {
            subject: currentTaskObject.subject,
            chapter: currentTaskObject.chapter,
            title: currentTaskObject.title,
            expectedMinutes: currentTaskObject.expectedMinutes
          } : {}
        })
      });

      if (response.ok) {
        const botsReply = await response.json();
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const newBotMessages: Message[] = botsReply.map((bot: any, idx: number) => ({
          id: `bot-msg-${Date.now()}-${idx}`,
          senderId: bot.sender.toLowerCase().replace(/ /g, "-"),
          senderName: bot.sender,
          senderRole: bot.role as ClassmateRole,
          senderAvatar: bot.avatar,
          text: bot.text,
          timestamp
        }));

        setMessages(prev => prev.concat(newBotMessages));
      }
    } catch (e) {
      console.error("Failed to fetch bot responses:", e);
    } finally {
      setActiveChattingMocker(false);
    }
  };

  // Submit active task
  const submitTask = () => {
    if (!activeTask) return;

    const timeSpentMinutes = Math.floor(timerSeconds / 60);
    const expectedMinutes = Math.round(expectedTimerSeconds / 60);
    
    // Calculate study achievement ratio
    const completionRatio = expectedTimerSeconds > 0 ? (timerSeconds / expectedTimerSeconds) : 0;
    
    let rewardXP = 0;
    let remarks = "";

    if (timerSeconds < 60) {
      // Speedrun / Immediate submit
      rewardXP = 15;
      remarks = "Instant check-off logged. (Speedrun session, +15 XP)";
    } else if (completionRatio >= 0.8) {
      // Rigorous completion (focused for 80% or more of expected time)
      rewardXP = 120;
      remarks = "Full rigorous study session logged! (+120 XP Core Completion)";
      
      // Early completion speed bonus if completed slightly under the time but focused heavily
      if (timerSeconds < expectedTimerSeconds) {
        rewardXP += 40;
        remarks += " and pristine speed efficiency bonus (+40 XP!)";
      }
    } else if (completionRatio >= 0.5) {
      // Semi-rigorous fast solving (50% to 80% of expected time)
      rewardXP = 85;
      remarks = "Accelerated focus sheet cleared. (+85 XP Fast-Focus)";
    } else {
      // Accelerated solve (under 50% of expected time)
      rewardXP = 45;
      remarks = "Quick concept-test finished. (+45 XP High-Speed Focus)";
    }

    // Daily target achievement calculation (+100 XP)
    if (user.studyHours >= user.dailyTargetHours) {
      rewardXP += 100;
      remarks += " Reached daily study target hours! (+100 XP Super Target Bonus!).";
    }

    setUser(prev => ({
      ...prev,
      xp: prev.xp + rewardXP,
      currentTaskStatus: 'idle'
    }));

    // Update the task list
    setTasks(prev => prev.map(t => t.id === activeTask.id ? { ...t, status: 'completed' } : t));

    // Update classmates' counters
    setClassmates(prev => prev.map(c => {
      if (c.role === 'rival') {
        return { ...c, completedTasksCount: c.completedTasksCount + 1, xp: c.xp + 40 };
      }
      return c;
    }));

    // Submit log message
    const msgInput = `Hemanth finished: ${activeTask.subject} (${activeTask.chapter}) in ${timeSpentMinutes} mins / target ${expectedMinutes} mins. ${remarks}`;
    triggerServerReaction("user_completed_early", msgInput, activeTask);

    // Reset task
    setActiveTask(null);
    setTimerSeconds(0);
    setExpectedTimerSeconds(0);
    setClassroomStatus(`Homework sheet successfully submitted under real timing!`);
  };

  // Delete current task timer
  const deleteCurrentTimer = () => {
    setUser(prev => ({
      ...prev,
      currentTaskStatus: 'idle',
      xp: Math.max(0, prev.xp - 10) // missed timer penalty
    }));

    if (activeTask) {
      setTasks(prev => prev.map(t => t.id === activeTask.id ? { ...t, status: 'failed' } : t));
      triggerServerReaction("user_missed", `Hemanth surrendered of task: ${activeTask.title}`, activeTask);
    }

    setActiveTask(null);
    setTimerSeconds(0);
    setExpectedTimerSeconds(0);
    setClassroomStatus("Timer deleted. Kishore: 'Surrendered already-ya?? 💀😏'");
  };

  // Simulate progress of classmates dynamically to maintain rivalry
  const simulateClassmateActivity = () => {
    if (!activeTask) return;

    setClassmates(prevClassmates => {
      let isAnyComplete = false;
      const updatedClassmates = prevClassmates.map(c => {
        let currentProgress = c.currentTaskProgress;
        let cXP = c.xp;
        let cHours = c.studyHours;
        let statText = c.statusText;

        if (c.role === "rival") {
          currentProgress += Math.floor(Math.random() * 15) + 5;
          if (currentProgress >= 100 && c.currentTaskProgress < 100) {
            isAnyComplete = true;
            currentProgress = 100;
            cXP += 50 + 30; // Completed fast
            cHours += 0.5;
            statText = "Task fully complete, teasing lobby right now!";
          } else if (currentProgress < 100) {
            statText = `Solving ${activeTask.subject}... progress at ${currentProgress}% da Hemanth! 😏`;
          }
        } else if (c.role === "topper") {
          currentProgress += Math.floor(Math.random() * 12) + 4;
          if (currentProgress >= 100 && c.currentTaskProgress < 100) {
            currentProgress = 100;
            cXP += 60;
            cHours += 0.6;
            statText = "Completed derivation. Moving onto revision questions.";
          } else if (currentProgress < 100) {
            statText = `Deriving equations, working out step ${Math.floor(currentProgress/10)}...`;
          }
        } else {
          currentProgress += Math.floor(Math.random() * 8) + 2;
          if (currentProgress < 100) {
            statText = `Studying ${activeTask.subject} meticulously. progress: ${currentProgress}%`;
          }
        }

        const cappedHours = cHours > 12.0 ? 12.0 : cHours;
        return {
          ...c,
          currentTaskProgress: Math.min(100, currentProgress),
          xp: cXP,
          studyHours: parseFloat(cappedHours.toFixed(1)),
          statusText: statText
        };
      });

      // If Kishore completed before Hemanth, trigger the teasing message in chat
      if (isAnyComplete) {
        triggerServerReaction("timeout_teasing", `Kishore finished task while Hemanth is still at ${Math.floor((timerSeconds/expectedTimerSeconds)*100)}% progress.`, activeTask);
      }

      return updatedClassmates;
    });
  };

  // Send human message
  const sendUserMessage = async (text: string) => {
    if (!text.trim()) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = {
      id: "usr-" + Date.now(),
      senderId: "hem-usr",
      senderName: user.name,
      senderRole: "topper",
      senderAvatar: "🤠",
      text,
      timestamp
    };

    setMessages(prev => prev.concat(userMsg));

    // Request classmates' responses
    await triggerServerReaction("user_chat_message", text, activeTask);
  };

  // Send message to Sophia
  const sendSophiaMessage = async (text: string) => {
    if (!text.trim()) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      senderId: "hem-usr",
      senderName: user.name,
      senderRole: "topper",
      senderAvatar: "🤠",
      text,
      timestamp
    };

    let currentHistory: Message[] = [];
    setSophiaMessages(prev => {
      const updated = [...prev, userMsg];
      currentHistory = updated;
      return updated;
    });

    setSophiaTalking(true);
    setSophiaNotification(null); // clear notifications when active

    try {
      const response = await fetch("/api/sophia/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_input: text,
          is_auto_checkin: false,
          user_study_hours: user.studyHours,
          user_xp: user.xp,
          chat_history: currentHistory
        })
      });

      if (response.ok) {
        const data = await response.json();
        const replayMsg: Message = {
          id: `sophia-${Date.now()}`,
          senderId: "sophia",
          senderName: "Friend",
          senderRole: "support",
          senderAvatar: "💖",
          text: data.text,
          timestamp
        };
        setSophiaMessages(prev => [...prev, replayMsg]);
      }
    } catch (e) {
      console.error("Failed to fetch Sophia response:", e);
    } finally {
      setSophiaTalking(false);
    }
  };

  const resetSophiaTimer = (currentMode = sophiaMode) => {
    setSophiaTimerSeconds(currentMode === "fast" ? 30 : 1800);
  };

  const setSophiaMode = (mode: 'standard' | 'fast') => {
    setSophiaModeState(mode);
    resetSophiaTimer(mode);
  };

  const clearSophiaNotification = () => {
    setSophiaNotification(null);
  };

  // Generate End Class Report
  const generateEndClassReport = () => {
    // Collect stats using fresh references to avoid dependency locking safely
    const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const userHours = userRef.current.studyHours;
    
    // Earned XP is strictly based on the actual study hours of the user
    const earnedXPThisClass = Math.floor(userHours * 50);

    // Compute achievements and rank list
    const sortedLeaderboard = [
      { name: "Hemanth (You)", xp: userRef.current.xp, rank: 6 },
      ...classmatesRef.current.map(c => ({ name: c.name, xp: c.xp, rank: 0 }))
    ].sort((a,b) => b.xp - a.xp)
     .map((item, idx) => ({ ...item, rank: idx + 1 }));

    const userCurrentRankInList = sortedLeaderboard.find(it => it.name.startsWith("Hemanth"))?.rank || 6;

    // Badges collection
    const potentialBadges = ["Fastest Finisher", "Most Consistent", "Comeback Player", "9-Hour Beast", "Classroom Leader", "Sigma Grinder"];
    const earnedBadgesShuffled = [...potentialBadges].sort(() => 0.5 - Math.random());

    let finalTeacherRemark = "";
    let finalFriendReactions: string[] = [];
    let finalBadges: string[] = [];

    if (userHours === 0) {
      finalTeacherRemark = "Maveeran Sir says: \"Dei Hemanth, why did you study 0.0 hours today? Absolute slacker warning! Kishore is laughing at your laziness!\"";
      finalFriendReactions = [
        "Kishore: 'Dei Hemanth, ending class with exactly zero hours study? Surrendered already-ya?! 😂😏'",
        "Aakash: 'Enna machi, what happened today? No worries, tomorrow is a new day to bounce back! 🚀'",
        "Sameer: 'Take a calm breath, Hemanth. Let's study properly tomorrow. Consistency dhaan correct 🌸'"
      ];
      finalBadges = ["Slacker Flag 💀"];
    } else {
      const remarksBank = [
        "Maveeran Sir says: \"Fabulous focus today, Hemanth! But don't look at Kishore's rank. Maintain 12 hours of total daily discipline!\"",
        "Maths Miss says: \"Your calculation accuracy is getting sharp. Keep grinding complex exercises to Overtake!\"",
        "Chemistry Miss says: \"The carbonyl nomenclature was beautifully drafted. Consistency is the recipe of rank 1!\""
      ];
      finalTeacherRemark = remarksBank[Math.floor(Math.random() * remarksBank.length)];
      finalFriendReactions = [
        `Kishore: 'Sabba... Hemanth actually logged ${userHours.toFixed(1)} hours study. Not bad, but you can't beat me tomorrow! 😏'`,
        `Aakash: 'Massive workout da machi! That's absolute gold grid!'`,
        `Sameer: 'Extremely proud. 🌸 Keep up this beautiful momentum Hemanth!'`
      ];
      finalBadges = earnedBadgesShuffled.slice(0, Math.floor(Math.random() * 2) + 1);
    }

    const newReport: ClassReport = {
      id: `rep-manual-${Date.now()}`,
      date: today,
      studyHours: parseFloat(userHours.toFixed(1)),
      xpEarned: earnedXPThisClass,
      tasksCompleted: tasksRef.current.filter(t => t.status === "completed").length || 0,
      missedTimers: tasksRef.current.filter(t => t.status === "failed" || t.status === "missed").length || 0,
      fastestSubmission: "Electrostatics derivation in 18 mins",
      rankMovement: userCurrentRankInList < 6 ? "Overtook classmates (+ Rank Up!)" : "Maintained study rhythm",
      rank: userCurrentRankInList,
      teacherRemarks: finalTeacherRemark,
      friendReactions: finalFriendReactions,
      badges: finalBadges,
      leaderboardSnapshot: sortedLeaderboard
    };

    setReports(prev => [newReport, ...prev]);

    // Automatically clear completed, failed, and missed tasks on the day ends.
    // Keep only the pending tasks added by the student for their custom week schedule.
    let remainingTasks = tasksRef.current.filter(t => t.status === "pending");
    setTasks(remainingTasks);

    // Reset daily study values for starting fresh the next day
    setUser(prev => ({
      ...prev,
      xp: 0,
      studyHours: 0.0,
      currentTaskStatus: 'idle',
      activeStreak: userHours > 0 ? prev.activeStreak + 1 : 1
    }));

    // Reset classmates back to morning starting thresholds too so it's a fresh competitive race
    setClassmates([
      { id: "1", name: "Kishore", avatar: "⚡", role: "rival", xp: 220, studyHours: 2.1, statusText: "grinding 20 sums, almost done da 😏", currentTaskProgress: 25, completedTasksCount: 1 },
      { id: "2", name: "Rayyan", avatar: "🎯", role: "topper", xp: 190, studyHours: 1.8, statusText: "Analyzing HC Verma Physics problems.", currentTaskProgress: 20, completedTasksCount: 1 },
      { id: "3", name: "Guru", avatar: "📚", role: "topper", xp: 160, studyHours: 1.5, statusText: "solving integration worksheet chapter-3", currentTaskProgress: 15, completedTasksCount: 0 },
      { id: "4", name: "Azzez", avatar: "🔬", role: "topper", xp: 130, studyHours: 1.2, statusText: "organizing organic chemistry formulas", currentTaskProgress: 10, completedTasksCount: 0 },
      { id: "5", name: "Guna", avatar: "✏️", role: "topper", xp: 100, studyHours: 0.9, statusText: "memorizing chemical reactions", currentTaskProgress: 5, completedTasksCount: 0 },
      { id: "6", name: "Sameer", avatar: "🌸", role: "support", xp: 75, studyHours: 0.6, statusText: "doing formulas slow & clean, all the best!", currentTaskProgress: 5, completedTasksCount: 0 },
      { id: "7", name: "Aakash", avatar: "🚀", role: "hype", xp: 50, studyHours: 0.3, statusText: "Comeback arc loading da machi! 😤⚡", currentTaskProgress: 0, completedTasksCount: 0 }
    ]);

    setActiveTask(null);
    setTimerSeconds(0);
    setExpectedTimerSeconds(0);

    setActiveTab("report");
  };

  // Check date transition (Midnight / 12:00 AM Auto-End Class Sweeper)
  useEffect(() => {
    const checkMidnightCrossover = () => {
      const todayStr = new Date().toLocaleDateString("en-CA"); // e.g. "2026-05-22"
      const savedDay = localStorage.getItem("grind_last_calendar_day");
      
      if (!savedDay) {
        localStorage.setItem("grind_last_calendar_day", todayStr);
      } else if (savedDay !== todayStr) {
        localStorage.setItem("grind_last_calendar_day", todayStr);
        
        // Midnight crossed! Auto end class.
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setMessages(prev => [
          ...prev,
          {
            id: `sys-midnight-${Date.now()}`,
            senderId: "sys",
            senderName: "Classroom System",
            senderRole: "teacher",
            senderAvatar: "🏫",
            text: `🎯 Midnight crossed! Today's competitive round has transitioned. Generating automatic diagnostic report...`,
            timestamp
          }
        ]);
        
        generateEndClassReport();
      }
    };

    // Run check once on mount
    checkMidnightCrossover();

    // Check periodically every 15 seconds
    const interval = setInterval(checkMidnightCrossover, 15000);
    return () => clearInterval(interval);
  }, []);

  const assignStudyTime = (minutes: number) => {
    setExpectedTimerSeconds(minutes * 60);
    if (activeTask) {
      setActiveTask(prev => prev ? { ...prev, expectedMinutes: minutes } : null);
      setTasks(prev => prev.map(t => t.id === activeTask.id ? { ...t, expectedMinutes: minutes } : t));
    }
  };

  const startNewDayReset = () => {
    setUser({
      name: "Hemanth",
      xp: 0,
      studyHours: 0.0,
      dailyTargetHours: 12,
      currentTaskStatus: 'idle',
      activeStreak: 1
    });
    setClassmates([
      { id: "1", name: "Kishore", avatar: "⚡", role: "rival", xp: 220, studyHours: 2.1, statusText: "grinding 20 sums, almost done da 😏", currentTaskProgress: 25, completedTasksCount: 1 },
      { id: "2", name: "Rayyan", avatar: "🎯", role: "topper", xp: 190, studyHours: 1.8, statusText: "Analyzing HC Verma Physics problems.", currentTaskProgress: 20, completedTasksCount: 1 },
      { id: "3", name: "Guru", avatar: "📚", role: "topper", xp: 160, studyHours: 1.5, statusText: "solving integration worksheet chapter-3", currentTaskProgress: 15, completedTasksCount: 0 },
      { id: "4", name: "Azzez", avatar: "🔬", role: "topper", xp: 130, studyHours: 1.2, statusText: "organizing organic chemistry formulas", currentTaskProgress: 10, completedTasksCount: 0 },
      { id: "5", name: "Guna", avatar: "✏️", role: "topper", xp: 100, studyHours: 0.9, statusText: "memorizing chemical reactions", currentTaskProgress: 5, completedTasksCount: 0 },
      { id: "6", name: "Sameer", avatar: "🌸", role: "support", xp: 75, studyHours: 0.6, statusText: "doing formulas slow & clean, all the best!", currentTaskProgress: 5, completedTasksCount: 0 },
      { id: "7", name: "Aakash", avatar: "🚀", role: "hype", xp: 50, studyHours: 0.3, statusText: "Comeback arc loading da machi! 😤⚡", currentTaskProgress: 0, completedTasksCount: 0 }
    ]);
    setTasks([]);
    setActiveTask(null);
    setTimerSeconds(0);
    setExpectedTimerSeconds(0);
    setClassroomStatus("A fresh competitive day has started! All ranks reset and tasks cleared.");
  };

  const boostCompetitors = () => {
    setClassmates(prev => prev.map(c => {
      if (c.role === "rival") {
        return { ...c, xp: c.xp + 220, studyHours: parseFloat((c.studyHours + 2.0).toFixed(1)), statusText: "Just cracked the IIT mechanics core papers! dei Hemanth try overcoming this." };
      }
      if (c.role === "topper") {
        return { ...c, xp: c.xp + 180, studyHours: parseFloat((c.studyHours + 1.8).toFixed(1)), statusText: "Fully memorized 2 organic reactions sheet." };
      }
      return c;
    }));
    setClassroomStatus("Competitors are surging ahead in study hours! Kishore just posted a study surge!");
  };

  const fastForwardTimer = (minutes: number) => {
    if (user.currentTaskStatus === 'studying' && activeTask) {
      setTimerSeconds(prev => prev + minutes * 60);
      setUser(prev => ({
        ...prev,
        studyHours: parseFloat((prev.studyHours + (minutes / 60)).toFixed(3)),
        xp: prev.xp + (minutes * 3) // earn +3 XP per simulated minute
      }));
      setClassroomStatus(`Fast-forwarded study session by ${minutes} minutes!`);
    } else {
      setUser(prev => ({
        ...prev,
        studyHours: parseFloat((prev.studyHours + (minutes / 60)).toFixed(3)),
        xp: prev.xp + (minutes * 3)
      }));
      setClassroomStatus(`Fast-forwarded study hours by +(${minutes} mins).`);
    }
  };

  const clearHistory = (forceConfirm = true) => {
    if (forceConfirm || confirm("Dei, are you sure you want to clear your local storage history? Your study streak will be reset!")) {
      localStorage.removeItem("grind_user");
      localStorage.removeItem("grind_classmates");
      localStorage.removeItem("grind_tasks");
      localStorage.removeItem("grind_active_task");
      localStorage.removeItem("grind_messages");
      localStorage.removeItem("grind_reports");
      localStorage.removeItem("grind_joined");
      localStorage.removeItem("grind_timer_seconds");
      localStorage.removeItem("grind_expected_seconds");
      localStorage.removeItem("grind_sophia_messages");
      localStorage.removeItem("grind_sophia_timer");
      localStorage.removeItem("grind_sophia_mode");

      setUser({
        name: "Hemanth",
        xp: 0,
        studyHours: 0.0,
        dailyTargetHours: 12,
        currentTaskStatus: 'idle',
        activeStreak: 1
      });
      setClassmates(INITIAL_CLASSMATES);
      setTasks([]);
      setActiveTask(null);
      setMessages(INITIAL_MESSAGES);
      setReports(INITIAL_REPORTS);
      setIsJoinedClassroom(false);
      setTimerSeconds(0);
      setExpectedTimerSeconds(0);
      setSophiaMessages(INITIAL_SOPHIA_MESSAGES);
      setSophiaTimerSeconds(1800);
      setSophiaModeState("standard");
      setSophiaTalking(false);
      setSophiaNotification(null);
      setClassroomStatus("Simulated local database cleared successfully!");
      setActiveTab("landing");
    }
  };

  // Mock static Weekly Analytics for Hemanth
  const weeklyAnalytics: WeeklyAnalytics = {
    totalWeeklyHours: 48.6,
    dailyAverage: 6.9,
    bestDay: "Wednesday (8.5 Hours logged)",
    weakestDay: "Monday (3.2 Hours logged - Kishore was teasing too much)",
    strongestSubject: "Physics (Biot-Savart & Gauss Law completed)",
    weakestSubject: "Mathematics (Missed definite integral limits sum)",
    missedTimerCount: 2,
    focusBaseline: "Steady improvement baseline. Under high rival pressure from Kishore, focus spikes from 45% efficiency to a massive 92%. Aakash's hype encouragement is a consistent positive factor.",
    suggestions: [
      "Avoid clicking social buttons while Kishore is typing; his tease rates can distract your concentration.",
      "Pre-load 3 complex calculus tasks early in the morning, which forces the topper AI classmates (Rayyan/Guru) to active rivalry sooner.",
      "Submit Math sheets 5 minutes before scheduled targets to catch Kishore offguard. He reacts extremely funnily in chat when overtaken!"
    ]
  };

  return (
    <ClassroomContext.Provider value={{
      user,
      classmates,
      tasks,
      activeTask,
      messages,
      reports,
      weeklyAnalytics,
      isJoinedClassroom,
      activeTab,
      timerSeconds,
      expectedTimerSeconds,
      activeChattingMocker,
      classroomStatus,
      loginUser,
      logoutUser,
      joinClassroom,
      leaveClassroom,
      setActiveTab,
      addTask,
      deleteTask,
      selectTask,
      startStudyTimer,
      pauseStudyTimer,
      resumeStudyTimer,
      submitTask,
      deleteCurrentTimer,
      sendUserMessage,
      generateEndClassReport,
      simulateClassmateActivity,
      clearHistory,
      assignStudyTime,
      startNewDayReset,
      boostCompetitors,
      fastForwardTimer,
      // Sophia (Girlfriend / Caretaker) States & Methods
      sophiaMessages,
      sophiaTimerSeconds,
      sophiaMode,
      sophiaTalking,
      sophiaNotification,
      sendSophiaMessage,
      triggerSophiaCheckin,
      resetSophiaTimer,
      setSophiaMode,
      clearSophiaNotification,
      // Alive Check variables
      aliveCheckTimer,
      isAlivePromptActive,
      notificationPermission,
      clickIAmAlive,
      requestNotificationPermission
    }}>
      {children}
    </ClassroomContext.Provider>
  );
};

export const useClassroom = () => {
  const context = useContext(ClassroomContext);
  if (!context) {
    throw new Error("useClassroom must be used inside ClassroomProvider");
  }
  return context;
};
