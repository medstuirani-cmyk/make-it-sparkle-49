import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ArrowDownCircle, ArrowUpCircle, AlertTriangle, Zap } from "lucide-react";
import { loadAppData, saveAppData, CATEGORIES, type AppData, type Expense } from "@/lib/data";
import BottomNav from "@/components/BottomNav";
import XPBadge from "@/components/XPBadge";
import AddExpenseModal from "@/components/AddExpenseModal";
import { motion } from "framer-motion";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<AppData | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const loaded = loadAppData();
    if (!loaded.onboarded) {
      navigate("/");
      return;
    }
    setData(loaded);
  }, [navigate]);

  const handleAddExpense = useCallback((expense: Expense) => {
    if (!data) return;
    const updated: AppData = {
      ...data,
      expenses: [...data.expenses, expense],
      xp: data.xp + 10,
    };
    const totalSpent = updated.expenses.reduce((s, e) => s + e.amount, 0);
    const spendPercent = (totalSpent / updated.budget) * 100;

    if (spendPercent >= 90) {
      toast.error("⚠️ You've spent over 90% of your budget!", { description: "Consider cutting back on non-essentials." });
    } else if (spendPercent >= 75) {
      toast.warning("You've used 75% of your monthly budget", { description: "Be mindful of your remaining spending." });
    }

    toast.success(`+10 XP earned!`, { description: `Logged €${expense.amount.toFixed(2)} for ${expense.name}` });
    saveAppData(updated);
    setData(updated);
  }, [data]);

  if (!data) return null;

  const totalSpent = data.expenses.reduce((s, e) => s + e.amount, 0);
  const remaining = data.budget - totalSpent;
  const progressPercent = Math.min((totalSpent / data.budget) * 100, 100);
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const dayOfMonth = new Date().getDate();
  const daysRemaining = daysInMonth - dayOfMonth;
  const dailyBudget = daysRemaining > 0 ? (remaining / daysRemaining) : 0;

  const isOverBudget = totalSpent > data.budget;

  // Category breakdown
  const categorySpending = CATEGORIES.map((cat) => {
    const spent = data.expenses.filter((e) => e.category === cat.id).reduce((s, e) => s + e.amount, 0);
    return { ...cat, spent };
  }).filter((c) => c.spent > 0);

  // Recent expenses
  const recentExpenses = [...data.expenses].reverse().slice(0, 5);

  return (
    <div className="min-h-screen bg-background safe-bottom">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 max-w-md mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm text-muted-foreground">Welcome back,</p>
            <h1 className="text-xl font-bold font-display">{data.userName} 👋</h1>
          </div>
          <XPBadge xp={data.xp} streak={data.streak} />
        </div>

        {/* Budget Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-card rounded-2xl p-5 border border-card-border"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-muted-foreground">Monthly Budget</span>
            {isOverBudget && (
              <span className="flex items-center gap-1 text-xs text-destructive font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" /> Over budget!
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-3xl font-extrabold font-display">€{totalSpent.toFixed(2)}</span>
            <span className="text-muted-foreground text-sm">/ €{data.budget.toFixed(2)}</span>
          </div>

          <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`h-full rounded-full ${isOverBudget ? "bg-destructive" : progressPercent > 75 ? "bg-warning" : "bg-accent"}`}
            />
          </div>

          <div className="flex justify-between text-sm">
            <div>
              <span className="text-muted-foreground">Remaining</span>
              <p className={`font-bold ${isOverBudget ? "text-destructive" : "text-foreground"}`}>
                €{Math.max(0, remaining).toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <span className="text-muted-foreground">Daily budget</span>
              <p className="font-bold text-accent">€{Math.max(0, dailyBudget).toFixed(2)}</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl gradient-primary text-primary-foreground font-semibold active:scale-[0.97] transition-transform"
          >
            <ArrowDownCircle className="w-5 h-5" /> Expense
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border border-card-border text-foreground font-semibold bg-card hover:bg-card-hover transition-colors">
            <ArrowUpCircle className="w-5 h-5" /> Income
          </button>
        </div>

        {/* Today's Challenge Prompt */}
        <button
          onClick={() => navigate("/challenges")}
          className="w-full mt-4 flex items-center gap-3 p-4 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold">Daily Challenge Available</p>
            <p className="text-xs text-muted-foreground">Complete it to earn XP & keep your streak!</p>
          </div>
          <span className="text-xp font-bold text-sm">+25 XP</span>
        </button>

        {/* Categories */}
        {categorySpending.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-bold font-display mb-3">Spending by Category</h2>
            <div className="space-y-3">
              {categorySpending.map((cat) => (
                <div key={cat.id} className="flex items-center gap-3">
                  <span className="text-xl w-8 text-center">{cat.emoji}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{cat.label}</span>
                      <span className="text-muted-foreground">€{cat.spent.toFixed(2)}</span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${Math.min((cat.spent / data.budget) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Transactions */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold font-display">Recent</h2>
            <button onClick={() => navigate("/logs")} className="text-sm text-primary font-semibold">
              See all
            </button>
          </div>
          {recentExpenses.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4 text-center">No expenses yet. Add your first one!</p>
          ) : (
            <div className="space-y-2">
              {recentExpenses.map((exp) => {
                const cat = CATEGORIES.find((c) => c.id === exp.category);
                return (
                  <div key={exp.id} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-card-border">
                    <span className="text-xl w-8 text-center">{cat?.emoji || "💰"}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{exp.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(exp.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </p>
                    </div>
                    <span className="font-bold text-sm">-€{exp.amount.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <AddExpenseModal open={showAddModal} onClose={() => setShowAddModal(false)} onAdd={handleAddExpense} />
      <BottomNav />
    </div>
  );
};

export default Dashboard;
