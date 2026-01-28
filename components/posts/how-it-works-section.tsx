import { Search, MessageSquare, Zap } from "lucide-react";
import { StepCard } from "./step-card";

const steps = [
  {
    icon: Search,
    stepNumber: 1,
    title: "Browse & Understand",
    description:
      "Explore our catalog of industrial carbon and graphite products. Review detailed specifications and applications for each material.",
  },
  {
    icon: MessageSquare,
    stepNumber: 2,
    title: "Submit Inquiry",
    description:
      "Describe your specific requirements, usage scenarios, or technical questions. Our system captures all the details you provide.",
  },
  {
    icon: Zap,
    stepNumber: 3,
    title: "Get AI Assistance",
    description:
      "Receive instant AI-powered responses to help clarify specifications, suggest alternatives, and guide your procurement decisions.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="border-b border-border bg-muted/30 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            How It Works
          </h2>
          <p className="mt-3 text-muted-foreground">
            A streamlined process from product discovery to inquiry
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <StepCard
              key={step.stepNumber}
              icon={step.icon}
              stepNumber={step.stepNumber}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
