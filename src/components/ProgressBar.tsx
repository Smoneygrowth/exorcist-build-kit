import { cn } from "@/lib/utils";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function ProgressBar({ currentStep, totalSteps, className }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className={cn("w-full", className)}>
      <div className="h-1 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-foreground transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-3 flex justify-between items-center">
        <span className="body-small text-muted-foreground">
          Question {currentStep} of {totalSteps}
        </span>
        <span className="body-small text-muted-foreground">
          {Math.round(progress)}% complete
        </span>
      </div>
    </div>
  );
}
