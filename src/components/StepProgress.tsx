interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
}

const StepProgress = ({ currentStep, totalSteps }: StepProgressProps) => (
  <div className="flex gap-2 mb-8">
    {Array.from({ length: totalSteps }).map((_, i) => (
      <div
        key={i}
        className={`h-1 flex-1 rounded-full transition-all duration-500 ${
          i <= currentStep ? "bg-accent" : "bg-muted"
        }`}
      />
    ))}
  </div>
);

export default StepProgress;
