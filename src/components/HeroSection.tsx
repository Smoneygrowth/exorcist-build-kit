import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface HeroSectionProps {
  onStart: () => void;
}

export function HeroSection({ onStart }: HeroSectionProps) {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-3xl mx-auto text-center animate-fade-up">
        <h1 className="heading-display text-foreground mb-8">
          Is Your Portfolio
          <br />
          <span className="italic">Bleeding Wealth?</span>
        </h1>
        
        <p className="body-large text-muted-foreground max-w-xl mx-auto mb-12">
          Take the 60-second diagnostic used by Luxembourg's independent professionals 
          to identify hidden fees and tax drag.
        </p>
        
        <Button 
          variant="hero" 
          size="xl" 
          onClick={onStart}
          className="rounded-full group"
        >
          Start Diagnostic
          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Button>
        
        <p className="mt-8 body-small text-muted-foreground">
          Free • No account required • 60 seconds
        </p>
      </div>
    </section>
  );
}
