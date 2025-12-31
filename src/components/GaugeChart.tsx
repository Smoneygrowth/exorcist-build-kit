import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface GaugeChartProps {
  score: number;
  maxScore?: number;
  className?: string;
}

export function GaugeChart({ score, maxScore = 100, className }: GaugeChartProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const percentage = (score / maxScore) * 100;
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (percentage / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  const getScoreColor = () => {
    if (percentage >= 80) return "stroke-success";
    if (percentage >= 50) return "stroke-warning";
    return "stroke-destructive";
  };

  const getScoreLabel = () => {
    if (percentage >= 80) return "Strong Foundation";
    if (percentage >= 60) return "Good";
    if (percentage >= 40) return "Needs Improvement";
    return "Critical";
  };

  return (
    <div className={cn("relative inline-flex flex-col items-center", className)}>
      <svg
        className="transform -rotate-90"
        width="200"
        height="200"
        viewBox="0 0 100 100"
      >
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="hsl(var(--secondary))"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          className={cn("transition-all duration-1000 ease-out", getScoreColor())}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animatedScore === 0 ? circumference : offset}
          style={{
            transition: "stroke-dashoffset 1.5s ease-out",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-heading font-semibold text-foreground">
          {animatedScore}
        </span>
        <span className="text-sm text-muted-foreground mt-1">/ {maxScore}</span>
      </div>
      <span className="mt-4 text-lg font-medium text-foreground">{getScoreLabel()}</span>
    </div>
  );
}
