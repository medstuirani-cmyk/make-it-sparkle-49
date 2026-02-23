import { Flame, Star } from "lucide-react";
import { calculateLevel, xpForNextLevel } from "@/lib/data";

interface XPBadgeProps {
  xp: number;
  streak: number;
}

const XPBadge = ({ xp, streak }: XPBadgeProps) => {
  const level = calculateLevel(xp);
  const remaining = xpForNextLevel(xp);
  const progress = ((100 - remaining) / 100) * 100;

  return (
    <div className="flex items-center gap-3">
      {streak > 0 && (
        <div className="flex items-center gap-1 bg-streak/15 text-streak px-2.5 py-1 rounded-full text-sm font-bold">
          <Flame className="w-4 h-4" />
          {streak}
        </div>
      )}
      <div className="flex items-center gap-2 bg-xp/15 text-xp px-3 py-1 rounded-full">
        <Star className="w-4 h-4 fill-current" />
        <div className="text-sm font-bold">Lv.{level}</div>
        <div className="w-12 h-1.5 bg-xp/20 rounded-full overflow-hidden">
          <div className="h-full bg-xp rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
};

export default XPBadge;
