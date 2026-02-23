import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, ArrowDownCircle, ArrowUpCircle, Plus, Zap } from "lucide-react";
import BottomNav from "@/components/BottomNav";

interface Expense {
  amount: number;
  name: string;
  date: string;
}

interface AppData {
  onboarded: boolean;
  budget: number;
  goal: string | null;
  expenses: Expense[];
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<AppData | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("budgetApp");
    if (!raw) {
      navigate("/");
      return;
    }
    setData(JSON.parse(raw));
  }, [navigate]);

  if (!data) return null;

  const totalSpent = data.expenses.reduce((sum, e) => sum + e.amount, 0);
  const progressPercent = Math.min((totalSpent / data.budget) * 100, 100);
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const dailyBudget = (data.budget / daysInMonth).toFixed(2);

  const addExpense = (name: string, amount: number) => {
    const updated = {
      ...data,
      expenses: [...data.expenses, { name, amount, date: new Date().toISOString() }],
    };
    setData(updated);
    localStorage.setItem("budgetApp", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-foreground pb-24">
      {/* Monthly Overview Card */}
      <div className="bg-background rounded-b-3xl px-5 pt-6 pb-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-extrabold text-foreground">Monthly Overview</h1>
            <button className="w-10 h-10 rounded-full bg-card border border-card-border flex items-center justify-center text-muted-foreground">
              <Settings className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-progress-track rounded-full mb-3 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 bg-accent"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex justify-between text-sm mb-5">
            <div>
              <span className="text-muted-foreground">Spent</span>
              <p className="text-foreground font-bold">
                €{totalSpent.toFixed(2)} <span className="text-muted-foreground font-normal">/€{data.budget.toFixed(2)}</span>
              </p>
            </div>
            <div className="text-right">
              <span className="text-muted-foreground">Daily</span>
              <p className="text-foreground font-bold">€{dailyBudget}</p>
            </div>
          </div>

          {/* Expense / Income buttons */}
          <div className="flex gap-3 mb-5">
            <button
              onClick={() => {
                const name = prompt("Expense name:");
                const amt = prompt("Amount (€):");
                if (name && amt) addExpense(name, parseFloat(amt));
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-card-border text-foreground font-semibold"
            >
              <ArrowDownCircle className="w-5 h-5" /> Expense
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-card-border text-foreground font-semibold">
              <ArrowUpCircle className="w-5 h-5" /> Income
            </button>
          </div>

          <div className="border-t border-card-border pt-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-card border border-card-border flex items-center justify-center text-muted-foreground text-sm font-bold">
                {data.expenses.length}
              </div>
              <div>
                <p className="text-sm">
                  <span className="text-primary font-semibold">• Tracking your spending...</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Your budget will be generated in 7 days
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-card-border">
              <Zap className="w-5 h-5 text-primary" />
              <div>
                <p className="text-primary font-semibold text-sm">Skip the wait</p>
                <p className="text-xs text-muted-foreground">Upload 7 days of statements</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Bills */}
      <div className="max-w-md mx-auto px-5 mt-5">
        <div className="bg-foreground/5 border border-border rounded-2xl p-5 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-extrabold text-background">Monthly Bills</h2>
            <button className="flex items-center gap-1 text-sm text-muted-foreground border border-border rounded-full px-3 py-1">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          <p className="text-sm text-muted-foreground">No bills added yet</p>
        </div>

        {/* Categories */}
        <div className="bg-foreground/5 border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-extrabold text-background">Categories</h2>
            <button className="flex items-center gap-1 text-sm text-muted-foreground border border-border rounded-full px-3 py-1">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-background">General</span>
            <span className="text-sm text-background">
              <span className="font-bold">€{totalSpent.toFixed(2)}</span>
              <span className="text-muted-foreground">/{data.budget.toFixed(2)}</span>
            </span>
          </div>
          <div className="w-full h-1.5 bg-progress-track rounded-full mt-2 overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
