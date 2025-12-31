import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { GaugeChart } from "@/components/GaugeChart";
import { AlertTriangle, Calendar, Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizAnswer {
  wealthManagement: string;
  feeStructure: string;
  etfType: string;
  taxOptimized: string;
}

interface ResultsDashboardProps {
  answers: QuizAnswer;
  email: string;
}

export function ResultsDashboard({ answers, email }: ResultsDashboardProps) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Calculate score based on answers
  const calculateScore = (): number => {
    let score = 100;

    // Wealth management deductions
    if (answers.wealthManagement === "private-bank") score -= 20;
    if (answers.wealthManagement === "retail-bank") score -= 15;
    if (answers.wealthManagement === "none") score -= 30;

    // Fee structure deductions
    if (answers.feeStructure === "high") score -= 25;
    if (answers.feeStructure === "unknown") score -= 15;

    // ETF type deductions
    if (answers.etfType === "distributing") score -= 15;
    if (answers.etfType === "unknown") score -= 10;

    // Tax optimization deductions
    if (answers.taxOptimized === "no") score -= 10;

    return Math.max(score, 20);
  };

  const score = calculateScore();
  const showWarning = answers.wealthManagement === "private-bank" || answers.etfType === "distributing";

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className={cn(
        "max-w-2xl w-full transition-all duration-700",
        showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}>
        <div className="text-center mb-12">
          <h1 className="heading-section text-foreground mb-4">
            Your Portfolio Efficiency Score
          </h1>
          <p className="body-regular text-muted-foreground">
            Here's how your current strategy stacks up.
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <GaugeChart score={score} />
        </div>

        {showWarning && (
          <div className="bg-warning/10 border border-warning/30 rounded-xl p-6 mb-10 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-foreground mb-2">
                  ALERT: Tax Drag Detected
                </h3>
                <p className="body-regular text-muted-foreground">
                  Based on your answers, you are likely losing{" "}
                  <span className="font-semibold text-foreground">€2,000–€5,000 per year</span>{" "}
                  in tax drag. This can be optimized with the right strategy.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4" style={{ animationDelay: "0.5s" }}>
          <Button
            variant="hero"
            size="xl"
            className="w-full rounded-lg group"
            onClick={() => window.open("https://calendly.com/romain-smartmoneygrowth/new-meeting", "_blank")}
          >
            <Calendar className="h-5 w-5 mr-2" />
            Book Your Strategy Review
          </Button>

          <button className="w-full flex items-center justify-center gap-2 py-4 text-muted-foreground hover:text-foreground transition-colors">
            <Download className="h-4 w-4" />
            <span className="body-small underline-offset-4 hover:underline">
              Download the Fix-It Guide
            </span>
          </button>
        </div>

        <div className="mt-16 pt-8 border-t border-border text-center">
          <p className="body-small text-muted-foreground">
            Results sent to {email}
          </p>
        </div>
      </div>
    </section>
  );
}
