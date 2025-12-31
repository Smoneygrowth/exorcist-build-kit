import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ProgressBar";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizAnswer {
  wealthManagement: string;
  feeStructure: string;
  etfType: string;
  taxOptimized: string;
}

interface QuizSectionProps {
  onComplete: (answers: QuizAnswer) => void;
  onBack: () => void;
}

const questions = [
  {
    id: "wealthManagement",
    question: "How do you currently manage your wealth?",
    options: [
      { value: "private-bank", label: "Private Bank" },
      { value: "retail-bank", label: "Retail Bank" },
      { value: "diy", label: "DIY on Interactive Brokers" },
      { value: "none", label: "I don't invest yet" },
    ],
  },
  {
    id: "feeStructure",
    question: "What is your approximate annual fee structure?",
    options: [
      { value: "high", label: "> 1.5%" },
      { value: "low", label: "< 0.5%" },
      { value: "unknown", label: "I have no idea" },
    ],
  },
  {
    id: "etfType",
    question: "Do you use Accumulating or Distributing ETFs?",
    options: [
      { value: "accumulating", label: "Accumulating" },
      { value: "distributing", label: "Distributing" },
      { value: "unknown", label: "What is that?" },
    ],
  },
  {
    id: "taxOptimized",
    question: "Are you confident your portfolio is tax-optimized for Luxembourg?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
];

export function QuizSection({ onComplete, onBack }: QuizSectionProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer>({
    wealthManagement: "",
    feeStructure: "",
    etfType: "",
    taxOptimized: "",
  });

  const currentQuestion = questions[currentStep];

  const handleSelect = (value: string) => {
    const newAnswers = {
      ...answers,
      [currentQuestion.id]: value,
    };
    setAnswers(newAnswers);

    // Auto-advance after selection with a small delay
    setTimeout(() => {
      if (currentStep < questions.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        onComplete(newAnswers);
      }
    }, 300);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const selectedValue = answers[currentQuestion.id as keyof QuizAnswer];

  return (
    <section className="min-h-screen flex flex-col px-6 py-12">
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col">
        <ProgressBar 
          currentStep={currentStep + 1} 
          totalSteps={questions.length} 
          className="mb-12"
        />

        <button
          onClick={handleBack}
          className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8 self-start"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>

        <div className="flex-1 flex flex-col justify-center">
          <div key={currentStep} className="animate-fade-up">
            <h2 className="heading-section text-foreground mb-10">
              {currentQuestion.question}
            </h2>

            <div className="space-y-4">
              {currentQuestion.options.map((option) => (
                <Button
                  key={option.value}
                  variant={selectedValue === option.value ? "quizSelected" : "quiz"}
                  className="w-full rounded-lg text-base"
                  onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                  {selectedValue === option.value && (
                    <ArrowRight className="ml-auto h-5 w-5" />
                  )}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
