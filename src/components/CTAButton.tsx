import { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

interface CTAButtonProps {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

const CTAButton = ({ children, onClick, disabled }: CTAButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full py-4 rounded-2xl gradient-cta text-primary-foreground font-semibold text-lg flex items-center justify-center gap-2 transition-opacity disabled:opacity-40 active:scale-[0.98]"
    >
      {children}
      <ChevronRight className="w-5 h-5" />
    </button>
  );
};

export default CTAButton;
