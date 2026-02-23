export interface Expense {
  id: string;
  amount: number;
  name: string;
  category: string;
  date: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  completed: boolean;
  icon: string;
  type: "daily" | "weekly" | "milestone";
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  streak: number;
  rank: number;
  savings: number;
}

export interface AppData {
  onboarded: boolean;
  budget: number;
  goal: string | null;
  expenses: Expense[];
  xp: number;
  streak: number;
  level: number;
  completedChallenges: string[];
  userName: string;
}

export const defaultAppData: AppData = {
  onboarded: false,
  budget: 500,
  goal: null,
  expenses: [],
  xp: 0,
  streak: 0,
  level: 1,
  completedChallenges: [],
  userName: "Student",
};

export const CATEGORIES = [
  { id: "food", label: "Food & Drinks", emoji: "🍔", color: "hsl(25 95% 55%)" },
  { id: "transport", label: "Transport", emoji: "🚌", color: "hsl(210 85% 55%)" },
  { id: "shopping", label: "Shopping", emoji: "🛍️", color: "hsl(290 75% 55%)" },
  { id: "entertainment", label: "Entertainment", emoji: "🎮", color: "hsl(145 65% 45%)" },
  { id: "education", label: "Education", emoji: "📚", color: "hsl(45 95% 55%)" },
  { id: "bills", label: "Bills", emoji: "📋", color: "hsl(0 75% 55%)" },
  { id: "other", label: "Other", emoji: "💰", color: "hsl(240 5% 50%)" },
];

export function loadAppData(): AppData {
  try {
    const raw = localStorage.getItem("budgetApp");
    if (raw) return { ...defaultAppData, ...JSON.parse(raw) };
  } catch {}
  return { ...defaultAppData };
}

export function saveAppData(data: AppData) {
  localStorage.setItem("budgetApp", JSON.stringify(data));
}

export function calculateLevel(xp: number): number {
  return Math.floor(xp / 100) + 1;
}

export function xpForNextLevel(xp: number): number {
  return 100 - (xp % 100);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}
