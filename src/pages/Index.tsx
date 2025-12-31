import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { QuizSection } from "@/components/QuizSection";
import { EmailGate } from "@/components/EmailGate";
import { ResultsDashboard } from "@/components/ResultsDashboard";

type AppState = "hero" | "quiz" | "email" | "results";

interface QuizAnswer {
  wealthManagement: string;
  feeStructure: string;
  etfType: string;
  taxOptimized: string;
}

const Index = () => {
  const [state, setState] = useState<AppState>("hero");
  const [answers, setAnswers] = useState<QuizAnswer | null>(null);
  const [email, setEmail] = useState("");

  const handleStartQuiz = () => {
    setState("quiz");
  };

  const handleQuizComplete = (quizAnswers: QuizAnswer) => {
    setAnswers(quizAnswers);
    setState("email");
  };

  const handleEmailSubmit = (submittedEmail: string) => {
    setEmail(submittedEmail);
    setState("results");
  };

  const handleBackToHero = () => {
    setState("hero");
  };

  return (
    <main className="min-h-screen bg-background">
      {state === "hero" && <HeroSection onStart={handleStartQuiz} />}
      {state === "quiz" && (
        <QuizSection onComplete={handleQuizComplete} onBack={handleBackToHero} />
      )}
      {state === "email" && <EmailGate onSubmit={handleEmailSubmit} />}
      {state === "results" && answers && (
        <ResultsDashboard answers={answers} email={email} />
      )}
    </main>
  );
};

export default Index;
