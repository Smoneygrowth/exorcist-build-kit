import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

interface DiagnosticState {
  baselineFee: number;
  etfFamiliarity: string;
  quizGuess: string;
  isHighOpportunityCost: boolean;
  email: string;
}

export function DiagnosticFlow() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [state, setState] = useState<DiagnosticState>({
    baselineFee: 0,
    etfFamiliarity: "",
    quizGuess: "",
    isHighOpportunityCost: false,
    email: "",
  });
  const { toast } = useToast();

  const handleNext = () => {
    if (currentStep < 8) {
      setCurrentStep((prev) => (prev + 1) as Step);
    }
  };

  const handleStep1 = (option: string) => {
    let fee = 0;
    let highOpportunity = false;

    switch (option) {
      case "private-bank":
        fee = 2.0;
        break;
      case "retail-bank":
        fee = 1.5;
        break;
      case "advisor":
        fee = 2.5;
        break;
      case "diy":
        fee = 0.5;
        break;
      case "not-investing":
        fee = 0;
        highOpportunity = true;
        break;
    }

    setState((prev) => ({
      ...prev,
      baselineFee: fee,
      isHighOpportunityCost: highOpportunity,
    }));
    handleNext();
  };

  const handleStep2 = (option: string) => {
    let fee = state.baselineFee;

    switch (option) {
      case "expensive":
        fee = 2.0;
        break;
      case "moderate":
        fee = 1.0;
        break;
      case "efficient":
        fee = 0.3;
        break;
      case "no-idea":
        // Keep baselineFee from Step 1
        break;
    }

    setState((prev) => ({ ...prev, baselineFee: fee }));
    handleNext();
  };

  const handleStep4 = (familiarity: string) => {
    setState((prev) => ({ ...prev, etfFamiliarity: familiarity }));
    handleNext();
  };

  const handleStep5 = (guess: string) => {
    setState((prev) => ({ ...prev, quizGuess: guess }));
    handleNext();
  };

  const handleEmailSubmit = async (email: string) => {
    try {
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: {
          email,
          name: "Future Client",
          message: `Diagnostic completed. Fee: ${state.baselineFee}%, ETF familiarity: ${state.etfFamiliarity}, Quiz guess: ${state.quizGuess}`,
        },
      });

      if (error) {
        console.error("Error submitting email:", error);
        toast({
          title: "Error",
          description: "Failed to submit email. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setState((prev) => ({ ...prev, email }));
      handleNext();
    } catch (err) {
      console.error("Error submitting email:", err);
      toast({
        title: "Error",
        description: "Failed to submit email. Please try again.",
        variant: "destructive",
      });
    }
  };

  const progress = (currentStep / 8) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-secondary z-50">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          {currentStep === 1 && <Step1Provider onSelect={handleStep1} />}
          {currentStep === 2 && <Step2RealityCheck onSelect={handleStep2} />}
          {currentStep === 3 && <Step3Educational onNext={handleNext} />}
          {currentStep === 4 && <Step4Familiarity onSelect={handleStep4} />}
          {currentStep === 5 && <Step5PopQuiz onSelect={handleStep5} />}
          {currentStep === 6 && <Step6Reveal onNext={handleNext} />}
          {currentStep === 7 && <Step7Gate onSubmit={handleEmailSubmit} />}
          {currentStep === 8 && <Step8Results state={state} />}
        </div>
      </div>
    </div>
  );
}

interface OptionButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}

function OptionButton({ children, onClick, className }: OptionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-5 text-left rounded-xl border border-border bg-card",
        "hover:border-primary hover:bg-accent/50 transition-all duration-200",
        "text-foreground font-medium",
        className
      )}
    >
      {children}
    </button>
  );
}

function Step1Provider({ onSelect }: { onSelect: (option: string) => void }) {
  return (
    <div className="animate-fade-in space-y-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-wider text-muted-foreground">
          Step 1 of 7
        </p>
        <h1 className="text-3xl md:text-4xl font-serif font-medium text-foreground leading-tight">
          Who currently manages your investments?
        </h1>
      </div>

      <div className="space-y-3">
        <OptionButton onClick={() => onSelect("private-bank")}>
          Private Bank / Wealth Manager
        </OptionButton>
        <OptionButton onClick={() => onSelect("retail-bank")}>
          Retail Bank (Spuerkeess, ING, etc.)
        </OptionButton>
        <OptionButton onClick={() => onSelect("advisor")}>
          Financial Advisor / Insurance
        </OptionButton>
        <OptionButton onClick={() => onSelect("diy")}>
          I invest myself
        </OptionButton>
        <OptionButton onClick={() => onSelect("not-investing")}>
          I don't invest yet
        </OptionButton>
      </div>
    </div>
  );
}

function Step2RealityCheck({ onSelect }: { onSelect: (option: string) => void }) {
  return (
    <div className="animate-fade-in space-y-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-wider text-muted-foreground">
          Step 2 of 7
        </p>
        <h1 className="text-3xl md:text-4xl font-serif font-medium text-foreground leading-tight">
          How much are you paying in total fees per year?
        </h1>
      </div>

      <div className="space-y-3">
        <OptionButton onClick={() => onSelect("expensive")}>
          &gt; 1.5% (Expensive)
        </OptionButton>
        <OptionButton onClick={() => onSelect("moderate")}>
          Between 0.5% - 1.5%
        </OptionButton>
        <OptionButton onClick={() => onSelect("efficient")}>
          &lt; 0.5% (Efficient)
        </OptionButton>
        <OptionButton onClick={() => onSelect("no-idea")}>
          I have no idea
        </OptionButton>
      </div>
    </div>
  );
}

function Step3Educational({ onNext }: { onNext: () => void }) {
  return (
    <div className="animate-fade-in space-y-8 text-center">
      <div className="space-y-6">
        <p className="text-sm uppercase tracking-wider text-muted-foreground">
          Step 3 of 7
        </p>
        <h1 className="text-3xl md:text-4xl font-serif font-medium text-foreground leading-tight">
          Did you know?
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto">
          Over 15 years, 90% of active fund managers fail to beat the market average. 
          Yet, they charge 10x the fees of an ETF. Let's see what that costs you.
        </p>
      </div>

      <Button
        onClick={onNext}
        size="lg"
        className="mt-8"
      >
        Next
      </Button>
    </div>
  );
}

function Step4Familiarity({ onSelect }: { onSelect: (option: string) => void }) {
  return (
    <div className="animate-fade-in space-y-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-wider text-muted-foreground">
          Step 4 of 7
        </p>
        <h1 className="text-3xl md:text-4xl font-serif font-medium text-foreground leading-tight">
          How familiar are you with ETFs?
        </h1>
      </div>

      <div className="space-y-3">
        <OptionButton onClick={() => onSelect("experienced")}>
          I already use them.
        </OptionButton>
        <OptionButton onClick={() => onSelect("basic")}>
          I know the basics, but I'm not confident.
        </OptionButton>
        <OptionButton onClick={() => onSelect("none")}>
          An ETF... what?
        </OptionButton>
      </div>
    </div>
  );
}

function Step5PopQuiz({ onSelect }: { onSelect: (option: string) => void }) {
  return (
    <div className="animate-fade-in space-y-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-wider text-muted-foreground">
          Step 5 of 7
        </p>
        <h1 className="text-3xl md:text-4xl font-serif font-medium text-foreground leading-tight">
          Let's test your intuition.
        </h1>
        <p className="text-lg text-muted-foreground">
          If you invest €100,000 for 25 years... how much profit do you lose by paying 
          2% in bank fees vs. 0.2% in ETF fees?
        </p>
      </div>

      <div className="space-y-3">
        <OptionButton onClick={() => onSelect("20k")}>
          Maybe €20,000?
        </OptionButton>
        <OptionButton onClick={() => onSelect("60k")}>
          Around €60,000?
        </OptionButton>
        <OptionButton onClick={() => onSelect("150k")}>
          Over €150,000?
        </OptionButton>
      </div>
    </div>
  );
}

function Step6Reveal({ onNext }: { onNext: () => void }) {
  return (
    <div className="animate-fade-in space-y-8 text-center">
      <div className="space-y-6">
        <p className="text-sm uppercase tracking-wider text-muted-foreground">
          Step 6 of 7
        </p>
        <h1 className="text-3xl md:text-4xl font-serif font-medium text-foreground leading-tight">
          The Math is Brutal.
        </h1>
        <div className="space-y-4 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto">
          <p>
            Most people guess €20k. The real answer is <span className="text-foreground font-semibold">over €200,000</span>.
          </p>
          <p>
            Because fees compound, that 2% fee didn't just take a slice of the pie; 
            it ate half the growth.
          </p>
          <p className="text-foreground font-medium">
            That is the price of a small apartment in a foreign country, gone.
          </p>
        </div>
      </div>

      <Button
        onClick={onNext}
        size="lg"
        className="mt-8"
      >
        Show My Personal Score
      </Button>
    </div>
  );
}

function Step7Gate({ onSubmit }: { onSubmit: (email: string) => void }) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail || isLoading) return;

    setIsLoading(true);
    await onSubmit(email);
    setIsLoading(false);
  };

  return (
    <div className="animate-fade-in space-y-8 text-center">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-wider text-muted-foreground">
          Step 7 of 8
        </p>
        <h1 className="text-3xl md:text-4xl font-serif font-medium text-foreground leading-tight">
          Your Personal Score is Ready
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Enter your email to unlock your personalized investment diagnostic results.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
        <Input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-14 text-center text-lg"
          disabled={isLoading}
        />
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={!isValidEmail || isLoading}
        >
          {isLoading ? "Unlocking..." : "Unlock My Results"}
        </Button>
      </form>

      <p className="text-xs text-muted-foreground">
        We respect your privacy. No spam, ever.
      </p>
    </div>
  );
}

function Step8Results({ state }: { state: DiagnosticState }) {
  return (
    <div className="animate-fade-in space-y-8 text-center">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-wider text-muted-foreground">
          Your Results
        </p>
        <h1 className="text-3xl md:text-4xl font-serif font-medium text-foreground leading-tight">
          Your Investment Diagnostic
        </h1>
      </div>

      <div className="p-8 rounded-xl border border-border bg-card space-y-4">
        <p className="text-muted-foreground">
          Based on your answers, your estimated fee rate is:
        </p>
        <p className="text-5xl font-bold text-foreground">
          {state.baselineFee}%
        </p>
        <p className="text-sm text-muted-foreground">
          Results sent to: {state.email}
        </p>
      </div>
    </div>
  );
}
