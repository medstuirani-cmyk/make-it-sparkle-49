import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepProgress from "@/components/StepProgress";
import OptionCard from "@/components/OptionCard";
import CTAButton from "@/components/CTAButton";
import { Camera, ClipboardList, TrendingUp, Target, Shield, Wallet } from "lucide-react";

const TOTAL_STEPS = 4;

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [inputMethod, setInputMethod] = useState<"scan" | "manual" | null>(null);
  const [amount, setAmount] = useState("");
  const [itemName, setItemName] = useState("");
  const [budget, setBudget] = useState("");
  const [goal, setGoal] = useState<string | null>(null);

  const nextStep = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
    } else {
      // Save to localStorage and go to dashboard
      const data = {
        onboarded: true,
        budget: parseFloat(budget) || 100,
        goal,
        expenses: amount && itemName ? [{ amount: parseFloat(amount), name: itemName, date: new Date().toISOString() }] : [],
      };
      localStorage.setItem("budgetApp", JSON.stringify(data));
      navigate("/dashboard");
    }
  };

  const canProceed = () => {
    switch (step) {
      case 0: return true; // welcome
      case 1: return inputMethod !== null;
      case 2: return inputMethod === "scan" || (amount !== "" && itemName !== "");
      case 3: return budget !== "" && goal !== null;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto px-5 pt-6 pb-8">
      <StepProgress currentStep={step} totalSteps={TOTAL_STEPS} />

      <div className="flex-1 animate-slide-up" key={step}>
        {step === 0 && (
          <div className="flex flex-col justify-center flex-1 min-h-[60vh]">
            <h1 className="text-4xl font-extrabold text-foreground leading-tight mb-2">
              Take control of your money
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Track spending, set budgets, and reach your financial goals.
            </p>
          </div>
        )}

        {step === 1 && (
          <div>
            <h1 className="text-3xl font-extrabold text-foreground leading-tight mb-1">
              Start by logging something you bought today
            </h1>
            <p className="text-muted-foreground mb-8">Log your first purchase</p>

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
            <h1 className="text-3xl font-extrabold text-foreground leading-tight mb-1">
              {inputMethod === "scan" ? "Scan your receipt" : "Log your purchase"}
            </h1>
            <p className="text-muted-foreground mb-8">
              {inputMethod === "scan" ? "Camera feature coming soon! Use manual entry for now." : "Enter the details below"}
            </p>

            <label className="block text-sm font-semibold text-foreground mb-2">Amount</label>
            <div className="flex items-center bg-card border border-card-border rounded-xl px-4 py-3 mb-6">
              <span className="text-muted-foreground mr-3 text-lg">€</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="bg-transparent flex-1 text-3xl font-bold text-foreground text-center outline-none placeholder:text-muted-foreground/40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>

            <label className="block text-sm font-semibold text-foreground mb-2">What was it?</label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Bread"
              className="w-full bg-card border border-card-border rounded-xl px-4 py-4 text-foreground outline-none placeholder:text-muted-foreground/40 focus:border-primary transition-colors"
            />
          </div>
        )}

        {step === 3 && (
          <div>
            <h1 className="text-3xl font-extrabold text-foreground leading-tight mb-1">Quick Setup</h1>
            <p className="text-muted-foreground mb-8">Just two things and you're done.</p>

            <label className="block text-sm font-semibold text-foreground mb-2">
              Monthly budget <span className="text-destructive">*</span>
            </label>
            <div className="flex items-center bg-card border border-card-border rounded-xl px-4 py-3 mb-8">
              <span className="text-muted-foreground mr-3 text-lg">€</span>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="100"
                className="bg-transparent flex-1 text-3xl font-bold text-foreground text-center outline-none placeholder:text-muted-foreground/40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>

            <label className="block text-sm font-semibold text-foreground mb-3">
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
                  subtitle=""
                  selected={goal === g.id}
                  onClick={() => setGoal(g.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-8">
        <CTAButton onClick={nextStep} disabled={!canProceed()}>
          {step === 0 ? "Get Started" : step === TOTAL_STEPS - 1 ? "Create My Budget" : "Next"}
        </CTAButton>
      </div>
    </div>
  );
};

export default Onboarding;
