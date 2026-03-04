import BottomNav from "@/components/BottomNav";
import { motion } from "framer-motion";
import { BookOpen, Flame, Trophy, CheckCircle2, Lock, Play, Star } from "lucide-react";

type LessonStatus = "done" | "active" | "locked";

interface Lesson {
  title: string;
  xp: number;
  status: LessonStatus;
}

interface Module {
  title: string;
  description: string;
  icon: React.ReactNode;
  lessons: Lesson[];
  locked?: boolean;
}

const modules: Module[] = [
  {
    title: "Budgeting Basics",
    description: "Master the fundamentals of budgeting",
    icon: <span className="text-xl">€</span>,
    lessons: [
      { title: "What is a budget?", xp: 20, status: "done" },
      { title: "50/30/20 rule", xp: 20, status: "done" },
      { title: "Tracking expenses", xp: 20, status: "active" },
      { title: "Budget categories", xp: 20, status: "locked" },
      { title: "Monthly review", xp: 20, status: "locked" },
    ],
  },
  {
    title: "Saving Strategies",
    description: "Learn smart ways to save money",
    icon: <Lock className="w-5 h-5 text-muted-foreground" />,
    lessons: [],
    locked: true,
  },
  {
    title: "Smart Spending",
    description: "Spend wisely as a student",
    icon: <Lock className="w-5 h-5 text-muted-foreground" />,
    lessons: [],
    locked: true,
  },
  {
    title: "Investing 101",
    description: "Start your investment journey",
    icon: <Lock className="w-5 h-5 text-muted-foreground" />,
    lessons: [],
    locked: true,
  },
];

const completedCount = 2;
const totalLessons = 17;
const progressPercent = Math.round((completedCount / totalLessons) * 100);

const statusColors: Record<LessonStatus, string> = {
  done: "bg-accent/10 border-accent/30",
  active: "bg-primary/10 border-primary/30",
  locked: "bg-muted/50 border-border",
};

const statusIcon = (status: LessonStatus) => {
  if (status === "done") return <CheckCircle2 className="w-6 h-6 text-green-500" />;
  if (status === "active") return <Play className="w-5 h-5 text-amber-500 fill-amber-500" />;
  return <Lock className="w-5 h-5 text-muted-foreground" />;
};

const Learn = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto px-4 pt-12">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-foreground">Learn</h1>
          <p className="text-muted-foreground mt-1">Master your finances, one lesson at a time</p>
        </motion.div>

        {/* Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 rounded-2xl border border-border bg-card p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary" />
              <div>
                <h2 className="font-bold text-primary text-lg">Your Progress</h2>
                <p className="text-sm text-muted-foreground">{completedCount} of {totalLessons} lessons</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Trophy className="w-5 h-5" />
              {progressPercent}%
            </div>
          </div>

          <div className="mt-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500" />
              <div>
                <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">Daily Goal</p>
                <p className="text-xs text-muted-foreground">Complete 1 lesson today to keep the streak!</p>
              </div>
            </div>
            <span className="font-bold text-foreground text-sm">0/1</span>
          </div>
        </motion.div>

        {/* Modules */}
        <div className="mt-6 space-y-4">
          {modules.map((mod, i) => (
            <motion.div
              key={mod.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.07 }}
              className="rounded-2xl border border-border bg-card p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                    {mod.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{mod.title}</h3>
                    <p className="text-xs text-muted-foreground">{mod.description}</p>
                  </div>
                </div>
                {mod.locked && <Play className="w-5 h-5 text-muted-foreground" />}
              </div>

              {!mod.locked && mod.lessons.length > 0 && (
                <>
                  {/* Module progress bar */}
                  <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${(mod.lessons.filter(l => l.status === "done").length / mod.lessons.length) * 100}%` }}
                    />
                  </div>

                  <div className="mt-3 space-y-2">
                    {mod.lessons.map((lesson) => (
                      <div
                        key={lesson.title}
                        className={`flex items-center justify-between rounded-xl border p-3 ${statusColors[lesson.status]}`}
                      >
                        <div className="flex items-center gap-3">
                          {statusIcon(lesson.status)}
                          <div>
                            <p className="font-semibold text-sm text-foreground">{lesson.title}</p>
                            <div className="flex items-center gap-1 text-xs text-amber-500">
                              <Star className="w-3 h-3" />
                              +{lesson.xp} XP
                            </div>
                          </div>
                        </div>
                        {lesson.status === "done" && <span className="text-xs font-semibold text-green-600 dark:text-green-400">Done</span>}
                        {lesson.status === "active" && (
                          <span className="text-xs font-bold text-white bg-amber-500 px-3 py-1 rounded-full">Start</span>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Learn;
