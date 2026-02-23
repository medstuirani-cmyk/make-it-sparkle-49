import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadAppData, type AppData, type LeaderboardEntry } from "@/lib/data";
import BottomNav from "@/components/BottomNav";
import XPBadge from "@/components/XPBadge";
import { Crown, Flame, Medal, Star, Users } from "lucide-react";
import { motion } from "framer-motion";

// Mock leaderboard data (would come from backend)
const MOCK_FRIENDS: LeaderboardEntry[] = [
  { id: "1", name: "Alex K.", avatar: "🧑‍🎓", xp: 890, streak: 12, rank: 1, savings: 245 },
  { id: "2", name: "Sarah M.", avatar: "👩‍💻", xp: 720, streak: 8, rank: 2, savings: 180 },
  { id: "3", name: "Jordan P.", avatar: "🧑‍🔬", xp: 580, streak: 5, rank: 3, savings: 120 },
  { id: "4", name: "Emma L.", avatar: "👩‍🎨", xp: 410, streak: 3, rank: 4, savings: 90 },
  { id: "5", name: "Marcus T.", avatar: "🧑‍💼", xp: 330, streak: 2, rank: 5, savings: 55 },
];

const rankColors = ["", "text-xp", "text-muted-foreground", "text-streak"];

const Leaderboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<AppData | null>(null);
  const [tab, setTab] = useState<"xp" | "savings" | "streak">("xp");

  useEffect(() => {
    const loaded = loadAppData();
    if (!loaded.onboarded) { navigate("/"); return; }
    setData(loaded);
  }, [navigate]);

  if (!data) return null;

  // Insert the user into leaderboard
  const userEntry: LeaderboardEntry = {
    id: "me",
    name: `${data.userName} (You)`,
    avatar: "🎓",
    xp: data.xp,
    streak: data.streak,
    rank: 0,
    savings: Math.max(0, data.budget - data.expenses.reduce((s, e) => s + e.amount, 0)),
  };

  const allEntries = [...MOCK_FRIENDS, userEntry];
  const sorted = [...allEntries].sort((a, b) => {
    if (tab === "xp") return b.xp - a.xp;
    if (tab === "savings") return b.savings - a.savings;
    return b.streak - a.streak;
  }).map((e, i) => ({ ...e, rank: i + 1 }));

  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  return (
    <div className="min-h-screen bg-background safe-bottom">
      <div className="px-5 pt-6 max-w-md mx-auto">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-bold font-display">Leaderboard</h1>
          <XPBadge xp={data.xp} streak={data.streak} />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {([
            { key: "xp" as const, label: "XP", icon: <Star className="w-4 h-4" /> },
            { key: "savings" as const, label: "Savings", icon: <Medal className="w-4 h-4" /> },
            { key: "streak" as const, label: "Streaks", icon: <Flame className="w-4 h-4" /> },
          ]).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                tab === t.key ? "gradient-primary text-primary-foreground" : "bg-card border border-card-border text-secondary-foreground"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Top 3 Podium */}
        <div className="flex items-end justify-center gap-3 mb-6">
          {[top3[1], top3[0], top3[2]].map((entry, i) => {
            if (!entry) return null;
            const isFirst = i === 1;
            const isMe = entry.id === "me";
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`flex flex-col items-center ${isFirst ? "order-2" : i === 0 ? "order-1" : "order-3"}`}
              >
                {isFirst && <Crown className="w-6 h-6 text-xp mb-1" />}
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl border-2 ${
                  isMe ? "border-primary gradient-primary" : isFirst ? "border-xp bg-xp/10" : "border-card-border bg-card"
                } ${isFirst ? "w-16 h-16" : ""}`}>
                  {entry.avatar}
                </div>
                <p className={`text-xs font-semibold mt-1.5 text-center max-w-[80px] truncate ${isMe ? "text-primary" : ""}`}>
                  {entry.name}
                </p>
                <span className={`text-xs font-bold mt-0.5 ${rankColors[entry.rank] || "text-muted-foreground"}`}>
                  {tab === "xp" ? `${entry.xp} XP` : tab === "savings" ? `€${entry.savings}` : `🔥 ${entry.streak}`}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Rest of list */}
        <div className="space-y-2">
          {rest.map((entry, i) => {
            const isMe = entry.id === "me";
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  isMe ? "border-primary/30 bg-primary/5" : "border-card-border bg-card"
                }`}
              >
                <span className="text-sm font-bold text-muted-foreground w-6 text-center">{entry.rank}</span>
                <span className="text-xl">{entry.avatar}</span>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm truncate ${isMe ? "text-primary" : ""}`}>{entry.name}</p>
                </div>
                <span className="text-sm font-bold">
                  {tab === "xp" ? `${entry.xp} XP` : tab === "savings" ? `€${entry.savings}` : `🔥 ${entry.streak}`}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Invite */}
        <button className="w-full mt-6 py-3.5 rounded-xl border border-dashed border-primary/30 text-primary font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors">
          <Users className="w-4 h-4" /> Invite Friends to Compare
        </button>
      </div>
      <BottomNav />
    </div>
  );
};

export default Leaderboard;
