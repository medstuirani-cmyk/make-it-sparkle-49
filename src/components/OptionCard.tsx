import { ReactNode } from "react";

interface OptionCardProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  selected?: boolean;
  onClick: () => void;
}

const OptionCard = ({ icon, title, subtitle, selected, onClick }: OptionCardProps) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left ${
        selected
          ? "border-card-selected-border bg-card shadow-[0_0_0_1px_hsl(var(--card-selected-border))]"
          : "border-card-border bg-card hover:border-muted-foreground/30"
      }`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
        selected ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
      }`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {selected && (
        <svg className="w-6 h-6 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
    </button>
  );
};

export default OptionCard;
