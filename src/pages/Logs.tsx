import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadAppData, CATEGORIES, type AppData } from "@/lib/data";
import BottomNav from "@/components/BottomNav";
import { ArrowLeft } from "lucide-react";

const Logs = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<AppData | null>(null);

  useEffect(() => {
    const loaded = loadAppData();
    if (!loaded.onboarded) { navigate("/"); return; }
    setData(loaded);
  }, [navigate]);

  if (!data) return null;

  const sorted = [...data.expenses].reverse();
  const grouped: Record<string, typeof sorted> = {};
  sorted.forEach((exp) => {
    const key = new Date(exp.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(exp);
  });

  return (
    <div className="min-h-screen bg-background safe-bottom">
      <div className="px-5 pt-6 max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate("/dashboard")} className="w-9 h-9 rounded-full bg-card border border-card-border flex items-center justify-center">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-2xl font-bold font-display">All Expenses</h1>
        </div>

        {sorted.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">No expenses logged yet.</p>
        ) : (
          Object.entries(grouped).map(([date, expenses]) => (
            <div key={date} className="mb-6">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{date}</p>
              <div className="space-y-2">
                {expenses.map((exp) => {
                  const cat = CATEGORIES.find((c) => c.id === exp.category);
                  return (
                    <div key={exp.id} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-card-border">
                      <span className="text-xl w-8 text-center">{cat?.emoji || "💰"}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{exp.name}</p>
                        <p className="text-xs text-muted-foreground">{cat?.label || "Other"}</p>
                      </div>
                      <span className="font-bold text-sm">-€{exp.amount.toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default Logs;
