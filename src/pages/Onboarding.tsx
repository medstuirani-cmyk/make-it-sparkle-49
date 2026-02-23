import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepProgress from "@/components/StepProgress";
import OptionCard from "@/components/OptionCard";
import CTAButton from "@/components/CTAButton";
import { Camera, ClipboardList, TrendingUp, Target, Shield, Wallet, GraduationCap, Sparkles } from "lucide-react";
import { defaultAppData, saveAppData, CATEGORIES, generateId } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";

const TOTAL_STEPS = 4;

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [userName, setUserName] = useState("");
  const [inputMethod, setInputMethod] = useState<"scan" | "manual" | null>(null);
  const [amount, setAmount] = useState("");
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("food");
  const [budget, setBudget] = useState("");
  const [goal, setGoal] = useState<string | null>(null);

  const nextStep = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
    } else {
      const data = {
        ...defaultAppData,
        onboarded: true,
        userName: userName || "Student",
        budget: parseFloat(budget) || 500,
        goal,
        xp: 50, // bonus for completing onboarding
        streak: 1,
        expenses:
          amount && itemName
            ? [{ id: generateId(), amount: parseFloat(amount), name: itemName, category, date: new Date().toISOString() }]
            : [],
      };
      saveAppData(data);
      navigate("/dashboard");
    }
  };

  const canProceed = () => {
    switch (step) {
      case 0: return userName.trim().length > 0;
      case 1: return inputMethod !== null;
      case 2: return inputMethod === "scan" || (amount !== "" && itemName !== "");
      case 3: return budget !== "" && goal !== null;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto px-5 pt-6 pb-8">
      <StepProgress currentStep={step} totalSteps={TOTAL_STEPS} />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
          className="flex-1"
        >
          {step === 0 && (
            <div className="flex flex-col justify-center min-h-[60vh]">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mb-6 animate-pulse-glow">
                <GraduationCap className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-4xl font-extrabold font-display text-foreground leading-tight mb-2">
                Welcome to <span className="text-gradient-primary">SpendWise</span>
              </h1>
              <p className="text-muted-foreground text-lg mb-8">
                Track spending, earn XP, and level up your finances with friends.
              </p>
              <label className="block text-sm font-semibold mb-2">What should we call you?</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-card border border-card-border rounded-xl px-4 py-4 text-foreground outline-none placeholder:text-muted-foreground/30 focus:border-primary transition-colors"
                autoFocus
              />
            </div>
          )}

          {step === 1 && (
            <div>
              <h1 className="text-3xl font-extrabold font-display text-foreground leading-tight mb-1">
                Log your first expense
              </h1>
              <p className="text-muted-foreground mb-8">Let's start tracking!</p>

              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Automatic</p>
              <OptionCard
                icon={<Camera className="w-5 h-5" />}
                title="Scan a receipt"
                subtitle="Snap a photo of your receipt"
                selected={inputMethod === "scan"}
                onClick={() => setInputMethod("scan")}
              />

              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 mt-6">Manual</p>
              <OptionCard
                icon={<ClipboardList className="w-5 h-5" />}
                title="Type it in"
                subtitle="Enter amount and item name"
                selected={inputMethod === "manual"}
                onClick={() => setInputMethod("manual")}
              />
            </div>
          )}

          {step === 2 && (
            <div>
              <h1 className="text-3xl font-extrabold font-display text-foreground leading-tight mb-1">
                {inputMethod === "scan" ? "Scan your receipt" : "Log your purchase"}
              </h1>
              <p className="text-muted-foreground mb-8">
                {inputMethod === "scan" ? "Camera coming soon — use manual for now." : "Enter the details below"}
              </p>

              <label className="block text-sm font-semibold mb-2">Amount</label>
              <div className="flex items-center bg-card border border-card-border rounded-xl px-4 py-3 mb-5">
                <span className="text-muted-foreground mr-3 text-lg">€</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="bg-transparent flex-1 text-3xl font-bold text-foreground text-center outline-none placeholder:text-muted-foreground/30 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>

              <label className="block text-sm font-semibold mb-2">What was it?</label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="Coffee, lunch, textbook..."
                className="w-full bg-card border border-card-border rounded-xl px-4 py-4 text-foreground outline-none placeholder:text-muted-foreground/30 focus:border-primary transition-colors mb-5"
              />

              <label className="block text-sm font-semibold mb-3">Category</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      category === cat.id
                        ? "gradient-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {cat.emoji} {cat.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h1 className="text-3xl font-extrabold font-display text-foreground leading-tight mb-1">Quick Setup</h1>
              <p className="text-muted-foreground mb-8">Just two things and you're done.</p>

              <label className="block text-sm font-semibold mb-2">
                Monthly budget <span className="text-destructive">*</span>
              </label>
              <div className="flex items-center bg-card border border-card-border rounded-xl px-4 py-3 mb-8">
                <span className="text-muted-foreground mr-3 text-lg">€</span>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="500"
                  className="bg-transparent flex-1 text-3xl font-bold text-foreground text-center outline-none placeholder:text-muted-foreground/30 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>

              <label className="block text-sm font-semibold mb-3">
                What's your main goal? <span className="text-destructive">*</span>
              </label>
              <div className="space-y-3">
                {[
                  { id: "save", label: "Save faster", icon: <TrendingUp className="w-5 h-5" /> },
                  { id: "debt", label: "Get rid of debt", icon: <Target className="w-5 h-5" /> },
                  { id: "emergency", label: "Build emergency fund", icon: <Shield className="w-5 h-5" /> },
                  { id: "purchase", label: "Save for a big purchase", icon: <Wallet className="w-5 h-5" /> },
                ].map((g) => (
                  <OptionCard
                    key={g.id}
                    icon={g.icon}
                    title={g.label}
                    selected={goal === g.id}
                    onClick={() => setGoal(g.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8">
        <CTAButton onClick={nextStep} disabled={!canProceed()}>
          {step === 0 ? "Get Started" : step === TOTAL_STEPS - 1 ? "Create My Budget" : "Next"}
        </CTAButton>
        {step === 0 && (
          <div className="flex items-center justify-center gap-1 mt-4 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-xp" />
            <span>Earn <span className="text-xp font-semibold">50 XP</span> for completing setup</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
