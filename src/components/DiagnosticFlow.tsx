import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { GaugeChart } from "@/components/GaugeChart";
import { Calendar } from "lucide-react";

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

interface DiagnosticState {
  baselineFee: number;
  etfFamiliarity: string;
  quizGuess: string;
  isHighOpportunityCost: boolean;
  email: string;
  firstName: string;
}

export function DiagnosticFlow() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [state, setState] = useState<DiagnosticState>({
    baselineFee: 0,
    etfFamiliarity: "",
    quizGuess: "",
    isHighOpportunityCost: false,
    email: "",
    firstName: "",
  });
  const { toast } = useToast();

  const handleNext = () => {
    if (currentStep < 9) {
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

  const handleEmailSubmit = async (email: string, firstName: string) => {
    try {
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: {
          email,
          name: firstName,
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

      setState((prev) => ({ ...prev, email, firstName }));
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

  const progress = (currentStep / 9) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress bar with step indicator */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-2xl mx-auto px-6 py-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of 9
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% complete
            </span>
          </div>
          <div className="h-1 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          {currentStep === 1 && <Step1Provider onSelect={handleStep1} />}
          {currentStep === 2 && <Step2RealityCheck onSelect={handleStep2} />}
          {currentStep === 3 && <Step3Educational onNext={handleNext} />}
          {currentStep === 4 && <Step4Familiarity onSelect={handleStep4} />}
          {currentStep === 5 && <Step5PopQuiz onSelect={handleStep5} />}
          {currentStep === 6 && <Step6Reveal onNext={handleNext} />}
          {currentStep === 7 && <Step7Calculating onNext={handleNext} />}
          {currentStep === 8 && <Step8Gate onSubmit={handleEmailSubmit} />}
          {currentStep === 9 && <Step9Results state={state} />}
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
          Retail Bank or Insurer (Spuerkeess, ING, Lalux etc.)
        </OptionButton>
        <OptionButton onClick={() => onSelect("advisor")}>
          Financial Advisor (commissioned or % based)
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

function Step7Calculating({ onNext }: { onNext: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onNext();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div className="animate-fade-in space-y-8 text-center">
      <div className="space-y-6">
        <p className="text-sm uppercase tracking-wider text-muted-foreground">
          Step 7 of 9
        </p>
        <h1 className="text-3xl md:text-4xl font-serif font-medium text-foreground leading-tight">
          Calculating Your Score
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Analyzing your portfolio efficiency...
        </p>
      </div>

      <div className="flex justify-center py-8">
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-4 border-secondary animate-pulse" />
          <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-transparent border-t-primary animate-spin" />
        </div>
      </div>

      <div className="flex justify-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}

function Step8Gate({ onSubmit }: { onSubmit: (email: string, firstName: string) => void }) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidForm = isValidEmail && firstName.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidForm || isLoading) return;

    setIsLoading(true);
    await onSubmit(email, firstName.trim());
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
          Enter your details to unlock your personalized investment diagnostic results.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
        <Input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="h-14 text-center text-lg"
          disabled={isLoading}
          required
        />
        <Input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-14 text-center text-lg"
          disabled={isLoading}
          required
        />
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={!isValidForm || isLoading}
        >
          {isLoading ? "Unlocking..." : "Unlock My Results"}
        </Button>
      </form>

      <p className="text-xs text-muted-foreground">
        We respect your privacy. We will not send marketing communication.
      </p>
    </div>
  );
}

function Step9Results({ state }: { state: DiagnosticState }) {
  // Determine user profile based on their answers
  const getUserProfile = () => {
    // Case 1: User already invests in ETFs
    if (state.etfFamiliarity === "experienced") {
      return {
        score: 85,
        text: "Your portfolio is decent, but you are likely leaving money on the table. You can optimize further by activating securities lending and setting up smarter tax structuring.",
      };
    }
    
    // Case 3: User does not invest yet / Cash
    if (state.isHighOpportunityCost) {
      return {
        score: 15,
        text: "Inaction is costing you the most. While you wait for the perfect moment, inflation is burning your purchasing power and you are losing the one asset you can't buy back: time.",
      };
    }
    
    // Case 2: User uses expensive banks / active funds (default)
    return {
      score: 55,
      text: "Reducing your fees and using ETFs could lower the fees you pay by €2,000–€10,000 per year. Stop funding your banker's vacation and start funding your own.",
    };
  };

  const profile = getUserProfile();

  useEffect(() => {
    // Load Calendly widget script and CSS
    if (!document.querySelector('script[src*="calendly.com/assets/external/widget.js"]')) {
      const script = document.createElement("script");
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      document.body.appendChild(script);
    }
    if (!document.querySelector('link[href*="calendly.com/assets/external/widget.css"]')) {
      const link = document.createElement("link");
      link.href = "https://assets.calendly.com/assets/external/widget.css";
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
  }, []);

  const handleBookCall = () => {
    const baseUrl = "https://calendly.com/romain-smartmoneygrowth/new-meeting";
    const params = new URLSearchParams({
      name: state.firstName,
      email: state.email,
      hide_gdpr_banner: "1",
    });
    
    if (window.Calendly) {
      window.Calendly.initPopupWidget({ url: `${baseUrl}?${params.toString()}` });
    } else {
      // Fallback if script hasn't loaded
      window.open(`${baseUrl}?${params.toString()}`, "_blank");
    }
  };

  return (
    <div className="animate-fade-in space-y-8 text-center">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-wider text-muted-foreground">
          Your Results
        </p>
        <h1 className="text-3xl md:text-4xl font-serif font-medium text-foreground leading-tight">
          Your Investment Scorecard
        </h1>
      </div>

      <div className="p-8 rounded-2xl border border-border bg-card space-y-6">
        <div className="flex justify-center">
          <GaugeChart score={profile.score} maxScore={100} />
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-lg md:text-xl text-foreground leading-relaxed">
            {profile.text}
          </p>
        </div>

        <Button
          onClick={handleBookCall}
          size="lg"
          className="w-full bg-foreground text-background hover:bg-foreground/90"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Book Your Strategy Review
        </Button>

        <p className="text-xs text-muted-foreground">
          Results sent to: {state.email}
        </p>
      </div>
    </div>
  );
}
