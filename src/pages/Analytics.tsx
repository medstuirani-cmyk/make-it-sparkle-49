import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadAppData, CATEGORIES, type AppData } from "@/lib/data";
import BottomNav from "@/components/BottomNav";
import { Brain, TrendingDown, TrendingUp, AlertTriangle, Lightbulb, PieChart } from "lucide-react";
import { motion } from "framer-motion";
import { PieChart as ReChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const Analytics = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<AppData | null>(null);

  useEffect(() => {
    const loaded = loadAppData();
    if (!loaded.onboarded) {navigate("/");return;}
    setData(loaded);
  }, [navigate]);

  if (!data) return null;

  const totalSpent = data.expenses.reduce((s, e) => s + e.amount, 0);
  const remaining = data.budget - totalSpent;

  // Category data for pie chart
  const categoryData = CATEGORIES.map((cat) => {
    const spent = data.expenses.filter((e) => e.category === cat.id).reduce((s, e) => s + e.amount, 0);
    return { name: cat.label, value: spent, color: cat.color, emoji: cat.emoji };
  }).filter((c) => c.value > 0);

  // Daily spending for bar chart
  const dailyMap: Record<string, number> = {};
  data.expenses.forEach((exp) => {
    const day = new Date(exp.date).toLocaleDateString("en-US", { weekday: "short" });
    dailyMap[day] = (dailyMap[day] || 0) + exp.amount;
  });
  const dailyData = Object.entries(dailyMap).map(([day, amount]) => ({ day, amount }));

  // AI Insights (simulated — will be real with Cloud + Lovable AI)
  const spendPercent = totalSpent / data.budget * 100;
  const topCategory = categoryData.sort((a, b) => b.value - a.value)[0];
  const avgExpense = data.expenses.length > 0 ? totalSpent / data.expenses.length : 0;

  const insights = [
  ...(spendPercent > 80 ?
  [{ type: "warning" as const, icon: <AlertTriangle className="w-5 h-5" />, title: "Overspending Alert", text: `You've used ${spendPercent.toFixed(0)}% of your budget. Consider reducing discretionary spending.` }] :
  [{ type: "success" as const, icon: <TrendingDown className="w-5 h-5" />, title: "On Track!", text: `You're using only ${spendPercent.toFixed(0)}% of your budget. Great discipline!` }]),
  ...(topCategory ?
  [{ type: "info" as const, icon: <Lightbulb className="w-5 h-5" />, title: `Top Spending: ${topCategory.emoji} ${topCategory.name}`, text: `€${topCategory.value.toFixed(2)} spent here. Look for ways to cut back, like meal prepping or student discounts.` }] :
  []),
  ...(avgExpense > 15 ?
  [{ type: "warning" as const, icon: <TrendingUp className="w-5 h-5" />, title: "High Average Spend", text: `Your average transaction is €${avgExpense.toFixed(2)}. Try keeping it under €10 for daily purchases.` }] :
  []),
  { type: "tip" as const, icon: <Brain className="w-5 h-5" />, title: "AI Tip", text: "Connect to Lovable Cloud to unlock personalized AI spending analysis and smart budget recommendations!" }];


  const insightColors = {
    warning: "border-warning/30 bg-warning/5 text-warning",
    success: "border-success/30 bg-success/5 text-success",
    info: "border-info/30 bg-info/5 text-info",
    tip: "border-primary/30 bg-primary/5 text-primary"
  };

  return (
    <div className="min-h-screen bg-background safe-bottom">
      <div className="px-5 pt-6 max-w-md mx-auto">
        <div className="flex items-center gap-2 mb-5">
          <Brain className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold font-display">Analytics</h1>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="gradient-card rounded-xl p-4 border border-card-border">
            <p className="text-xs text-muted-foreground mb-1">Total Spent</p>
            <p className="text-xl font-extrabold font-display">€{totalSpent.toFixed(2)}</p>
          </div>
          <div className="gradient-card rounded-xl p-4 border border-card-border">
            <p className="text-xs text-muted-foreground mb-1">Remaining</p>
            <p className={`text-xl font-extrabold font-display ${remaining < 0 ? "text-destructive" : "text-accent"}`}>
              €{remaining.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Pie Chart */}
        {categoryData.length > 0 &&
        <div className="gradient-card rounded-2xl p-5 border border-card-border mb-5">
            <h2 className="text-lg font-bold font-display mb-3 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary" /> Category Breakdown
            </h2>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <ReChart>
                  <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value">
                  
                    {categoryData.map((entry, index) =>
                  <Cell key={index} fill={entry.color} />
                  )}
                  </Pie>
                </ReChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-3 mt-2">
              {categoryData.map((cat) =>
            <div key={cat.name} className="flex items-center gap-1.5 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: cat.color }} />
                  <span className="text-muted-foreground">{cat.emoji} €{cat.value.toFixed(2)}</span>
                </div>
            )}
            </div>
          </div>
        }

        {/* Daily Bar Chart */}
        {dailyData.length > 0 &&
        <div className="gradient-card rounded-2xl p-5 border border-card-border mb-5">
            <h2 className="text-lg font-bold font-display mb-3">Daily Spending</h2>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%" className="text-destructive bg-primary border border-secondary-foreground border-solid px-px py-px my-px mx-px">
                <BarChart data={dailyData}>
                  <XAxis dataKey="day" tick={{ fill: "hsl(240 5% 50%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "hsl(240 5% 50%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip
                  contentStyle={{ background: "hsl(240 8% 8%)", border: "1px solid hsl(240 6% 18%)", borderRadius: "0.75rem", color: "#fff" }}
                  formatter={(value: number) => [`€${value.toFixed(2)}`, "Spent"]} />
                
                  <Bar dataKey="amount" fill="hsl(265 85% 60%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        }

        {/* AI Insights */}
        <h2 className="text-lg font-bold font-display mb-3 flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" /> AI Insights
        </h2>
        <div className="space-y-3 mb-6">
          {insights.map((insight, i) =>
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-4 rounded-xl border ${insightColors[insight.type]}`}>
            
              <div className="flex items-start gap-3">
                <div className="shrink-0 mt-0.5">{insight.icon}</div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{insight.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{insight.text}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>);

};

export default Analytics;