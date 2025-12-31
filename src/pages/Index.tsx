import { useState } from "react";
import { DiagnosticFlow } from "@/components/DiagnosticFlow";
import { HeroSection } from "@/components/HeroSection";

const Index = () => {
  const [showDiagnostic, setShowDiagnostic] = useState(false);

  return (
    <main className="min-h-screen bg-background">
      {showDiagnostic ? (
        <DiagnosticFlow />
      ) : (
        <HeroSection onStart={() => setShowDiagnostic(true)} />
      )}
    </main>
  );
};

export default Index;
