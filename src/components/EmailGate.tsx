import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";

interface EmailGateProps {
  onSubmit: (email: string) => void;
}

export function EmailGate({ onSubmit }: EmailGateProps) {
  const [isCalculating, setIsCalculating] = useState(true);
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCalculating(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setIsValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onSubmit(email);
    }
  };

  if (isCalculating) {
    return (
      <section className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center animate-fade-up">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 border-4 border-secondary rounded-full" />
            <div className="absolute inset-0 border-4 border-foreground rounded-full border-t-transparent animate-spin" />
          </div>
          <h2 className="heading-section text-foreground mb-4">
            Calculating Your Score
          </h2>
          <p className="body-regular text-muted-foreground animate-pulse-subtle">
            Analyzing your portfolio efficiency...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center animate-scale-in">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-8">
          <Lock className="h-8 w-8 text-foreground" />
        </div>

        <h2 className="heading-section text-foreground mb-4">
          Your Efficiency Score is Ready
        </h2>
        
        <p className="body-regular text-muted-foreground mb-10">
          Enter your email to reveal your personalized report and recommendations.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={handleEmailChange}
            className="h-14 text-center text-lg rounded-lg border-2 focus:border-foreground transition-colors"
          />
          
          <Button
            type="submit"
            variant="hero"
            size="xl"
            disabled={!isValid}
            className="w-full rounded-lg"
          >
            Reveal My Score
          </Button>
        </form>

        <p className="mt-6 body-small text-muted-foreground">
          We respect your privacy. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
