import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadAppData, saveAppData, type AppData, type Challenge } from "@/lib/data";
import BottomNav from "@/components/BottomNav";
import XPBadge from "@/components/XPBadge";
import { Zap, Coffee, ShoppingBag, PiggyBank, BookOpen, Trophy, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const ALL_CHALLENGES: Challenge[] = [
  { id: "no-coffee", title: "No Coffee Day", description: "Skip buying coffee today and make it at home", xpReward: 25, completed: false, icon: "coffee", type: "daily" },
  { id: "log-3", title: "Log 3 Expenses", description: "Track at least 3 purchases today", xpReward: 15, completed: false, icon: "log", type: "daily" },
  { id: "under-10", title: "Spend Under €10", description: "Keep today's spending under €10", xpReward: 30, completed: false, icon: "piggy", type: "daily" },
  { id: "no-shopping", title: "No Shopping Week", description: "Avoid non-essential purchases for 7 days", xpReward: 100, completed: false, icon: "shopping", type: "weekly" },
  { id: "budget-book", title: "Read a Finance Tip", description: "Read one personal finance article today", xpReward: 10, completed: false, icon: "book", type: "daily" },
  { id: "streak-7", title: "7-Day Streak", description: "Log expenses for 7 consecutive days", xpReward: 150, completed: false, icon: "trophy", type: "milestone" },
  { id: "first-50", title: "Save First €50", description: "Stay €50 under your monthly budget", xpReward: 75, completed: false, icon: "piggy", type: "milestone" },
];

const iconMap: Record<string, React.ReactNode> = {
  coffee: <Coffee className="w-5 h-5" />,
  log: <Zap className="w-5 h-5" />,
  piggy: <PiggyBank className="w-5 h-5" />,
  shopping: <ShoppingBag className="w-5 h-5" />,
  book: <BookOpen className="w-5 h-5" />,
  trophy: <Trophy className="w-5 h-5" />,
};

const Challenges = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<AppData | null>(null);
  const [filter, setFilter] = useState<"all" | "daily" | "weekly" | "milestone">("all");

  useEffect(() => {
    const loaded = loadAppData();
    if (!loaded.onboarded) { navigate("/"); return; }
    setData(loaded);
  }, [navigate]);

  if (!data) return null;

  const challenges = ALL_CHALLENGES.map((c) => ({
    ...c,
    completed: data.completedChallenges.includes(c.id),
  }));

  const filtered = filter === "all" ? challenges : challenges.filter((c) => c.type === filter);
  const completedCount = challenges.filter((c) => c.completed).length;

  const completeChallenge = (id: string, xp: number) => {
    if (data.completedChallenges.includes(id)) return;
    const updated: AppData = {
      ...data,
      completedChallenges: [...data.completedChallenges, id],
      xp: data.xp + xp,
    };
    saveAppData(updated);
    setData(updated);
    toast.success(`🎉 Challenge completed! +${xp} XP`);
  };

  return (
    <div className="min-h-screen bg-background safe-bottom">
      <div className="px-5 pt-6 max-w-md mx-auto">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-bold font-display">Challenges</h1>
          <XPBadge xp={data.xp} streak={data.streak} />
        </div>

        {/* Progress */}
        <div className="gradient-card rounded-2xl p-4 border border-card-border mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Completed</span>
            <span className="text-sm font-bold text-xp">{completedCount}/{challenges.length}</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / challenges.length) * 100}%` }}
              className="h-full rounded-full gradient-gold"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-5 overflow-x-auto">
          {(["all", "daily", "weekly", "milestone"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize whitespace-nowrap transition-all ${
                filter === f ? "gradient-primary text-primary-foreground" : "bg-card border border-card-border text-secondary-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Challenge Cards */}
        <div className="space-y-3">
          {filtered.map((challenge, i) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`p-4 rounded-xl border transition-all ${
                challenge.completed
                  ? "border-success/30 bg-success/5"
                  : "border-card-border bg-card hover:bg-card-hover"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  challenge.completed ? "bg-success/20 text-success" : "gradient-primary text-primary-foreground"
                }`}>
                  {challenge.completed ? <CheckCircle2 className="w-5 h-5" /> : iconMap[challenge.icon]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">{challenge.title}</h3>
                    <span className={`text-xs font-bold ${challenge.completed ? "text-success" : "text-xp"}`}>
                      {challenge.completed ? "Done" : `+${challenge.xpReward} XP`}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{challenge.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                      challenge.type === "daily" ? "bg-info/15 text-info"
                        : challenge.type === "weekly" ? "bg-primary/15 text-primary"
                          : "bg-xp/15 text-xp"
                    }`}>
                      {challenge.type}
                    </span>
                    {!challenge.completed && (
                      <button
                        onClick={() => completeChallenge(challenge.id, challenge.xpReward)}
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Challenges;
