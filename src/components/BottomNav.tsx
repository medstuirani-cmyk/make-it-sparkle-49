import { useNavigate } from "react-router-dom";
import { LayoutGrid, FileText, PieChart, Tag, User } from "lucide-react";
import { useLocation } from "react-router-dom";

const tabs = [
  { label: "Budgets", icon: LayoutGrid, path: "/dashboard" },
  { label: "Logs", icon: FileText, path: "/logs" },
  { label: "Analytics", icon: PieChart, path: "/analytics" },
  { label: "Discounts", icon: Tag, path: "/discounts" },
  { label: "Profile", icon: User, path: "/profile" },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-foreground border-t border-border z-50">
      <div className="max-w-md mx-auto flex justify-around py-2 pb-[env(safe-area-inset-bottom,8px)]">
        {tabs.map((tab) => {
          const active = location.pathname === tab.path;
          return (
            <button
              key={tab.label}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 text-xs transition-colors ${
                active ? "text-background" : "text-muted-foreground"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
