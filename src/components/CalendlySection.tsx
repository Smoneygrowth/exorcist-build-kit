import { useEffect } from "react";

export function CalendlySection() {
  useEffect(() => {
    // Load Calendly widget script
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector(
        'script[src="https://assets.calendly.com/assets/external/widget.js"]'
      );
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return (
    <section id="calendly" className="py-20 px-6 bg-secondary/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-medium text-foreground mb-4">
            Book Your Free Consultation
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Schedule a call to discuss how you can optimize your investment strategy
            and reduce unnecessary fees.
          </p>
        </div>

        <div
          className="calendly-inline-widget rounded-xl overflow-hidden bg-card border border-border"
          data-url="https://calendly.com/romain-smartmoneygrowth/new-meeting?hide_gdpr_banner=1"
          style={{ minWidth: "320px", height: "700px" }}
        />
      </div>
    </section>
  );
}
