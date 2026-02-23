import { useNavigate, useLocation } from "react-router-dom";
import { LayoutGrid, FileText, PieChart, Trophy, User } from "lucide-react";

const tabs = [
  { label: "Home", icon: LayoutGrid, path: "/dashboard" },
  { label: "Logs", icon: FileText, path: "/logs" },
  { label: "Analytics", icon: PieChart, path: "/analytics" },
  { label: "Board", icon: Trophy, path: "/leaderboard" },
  { label: "Profile", icon: User, path: "/profile" },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-border">
      <div className="max-w-md mx-auto flex justify-around py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {tabs.map((tab) => {
          const active = location.pathname === tab.path;
          return (
            <button
              key={tab.label}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 text-[11px] rounded-xl transition-all ${
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className={`w-5 h-5 ${active ? "drop-shadow-[0_0_6px_hsl(265_85%_60%_/_0.5)]" : ""}`} />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
