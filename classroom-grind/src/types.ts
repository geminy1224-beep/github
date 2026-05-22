/**
 * Shared Type Declarations for Classroom Grind
 */

export interface Task {
  id: string;
  subject: string;
  chapter: string;
  title: string;
  expectedMinutes: number;
  status: 'pending' | 'active' | 'completed' | 'missed' | 'failed';
  createdAt: string;
}

export type ClassmateRole = 'rival' | 'silent' | 'hype' | 'support' | 'topper' | 'teacher';

export interface Classmate {
  id: string;
  name: string;
  avatar: string; // Emoji or visual representation
  role: ClassmateRole;
  subjectExpertise?: string;
  xp: number;
  studyHours: number;
  statusText: string;
  currentTaskProgress: number; // 0 to 100%
  completedTasksCount: number;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: ClassmateRole;
  senderAvatar: string;
  text: string;
  timestamp: string;
  reactions?: { [emoji: string]: number };
}

export interface ClassReport {
  id: string; // date string
  date: string;
  studyHours: number;
  xpEarned: number;
  tasksCompleted: number;
  missedTimers: number;
  fastestSubmission?: string; // Chapter name / minutes taken
  rankMovement: string; // "Up 2 ranks" or "+1 Rank"
  rank: number;
  teacherRemarks: string;
  friendReactions: string[]; // List of strings from friends or rivals
  badges: string[]; // Badge names
  leaderboardSnapshot: { name: string; xp: number; rank: number }[];
}

export interface WeeklyAnalytics {
  totalWeeklyHours: number;
  dailyAverage: number;
  bestDay: string;
  weakestDay: string;
  strongestSubject: string;
  weakestSubject: string;
  missedTimerCount: number;
  focusBaseline: string; // text explaining the baseline
  suggestions: string[];
}
