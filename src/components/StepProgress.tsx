import { useState } from "react";

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
}

const StepProgress = ({ currentStep, totalSteps }: StepProgressProps) => {
  return (
    <div className="flex gap-2 mb-8">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
            i <= currentStep ? "bg-progress-active" : "bg-progress-inactive"
          }`}
        />
      ))}
    </div>
  );
};

export default StepProgress;
