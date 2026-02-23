import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadAppData, saveAppData, calculateLevel, type AppData } from "@/lib/data";
import BottomNav from "@/components/BottomNav";
import { User, Settings, LogOut, Award, Flame, Star, ChevronRight, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

const Profile = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<AppData | null>(null);

  useEffect(() => {
    const loaded = loadAppData();
    if (!loaded.onboarded) { navigate("/"); return; }
    setData(loaded);
  }, [navigate]);

  if (!data) return null;

  const level = calculateLevel(data.xp);
  const totalSpent = data.expenses.reduce((s, e) => s + e.amount, 0);

  const stats = [
    { label: "Level", value: level, icon: <Star className="w-5 h-5 text-xp" /> },
    { label: "Total XP", value: data.xp, icon: <Award className="w-5 h-5 text-primary" /> },
    { label: "Streak", value: `${data.streak} days`, icon: <Flame className="w-5 h-5 text-streak" /> },
    { label: "Expenses", value: data.expenses.length, icon: <Settings className="w-5 h-5 text-info" /> },
  ];

  const handleReset = () => {
    if (confirm("Reset all data? This cannot be undone.")) {
      localStorage.removeItem("budgetApp");
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-background safe-bottom">
      <div className="px-5 pt-6 max-w-md mx-auto">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center text-4xl mb-3 shadow-[0_0_30px_-4px_hsl(265_85%_60%_/_0.3)]">
            🎓
          </div>
          <h1 className="text-xl font-bold font-display">{data.userName}</h1>
          <p className="text-sm text-muted-foreground">Level {level} Student</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="gradient-card rounded-xl p-4 border border-card-border flex items-center gap-3"
            >
              {stat.icon}
              <div>
                <p className="text-lg font-bold font-display">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <div className="gradient-card rounded-2xl p-5 border border-card-border mb-6">
          <h2 className="font-bold font-display mb-3">This Month</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Budget</span>
              <span className="font-semibold">€{data.budget.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Spent</span>
              <span className="font-semibold">€{totalSpent.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Challenges Done</span>
              <span className="font-semibold">{data.completedChallenges.length}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={() => navigate("/challenges")}
            className="w-full flex items-center gap-3 p-4 rounded-xl bg-card border border-card-border hover:bg-card-hover transition-colors"
          >
            <Award className="w-5 h-5 text-primary" />
            <span className="flex-1 text-left font-medium text-sm">View Challenges</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
          <button
            onClick={handleReset}
            className="w-full flex items-center gap-3 p-4 rounded-xl bg-card border border-card-border hover:bg-destructive/10 transition-colors"
          >
            <RotateCcw className="w-5 h-5 text-destructive" />
            <span className="flex-1 text-left font-medium text-sm text-destructive">Reset All Data</span>
          </button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Profile;
