import { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

interface CTAButtonProps {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

const CTAButton = ({ children, onClick, disabled }: CTAButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="w-full py-4 rounded-2xl gradient-primary text-primary-foreground font-bold text-lg flex items-center justify-center gap-2 transition-all disabled:opacity-30 active:scale-[0.97] shadow-[0_4px_20px_-4px_hsl(265_85%_60%_/_0.4)]"
  >
    {children}
    <ChevronRight className="w-5 h-5" />
  </button>
);

export default CTAButton;
