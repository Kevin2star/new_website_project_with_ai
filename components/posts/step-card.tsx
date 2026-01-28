import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface StepCardProps {
  icon: LucideIcon;
  stepNumber: number;
  title: string;
  description: string;
  className?: string;
}

export function StepCard({
  icon: Icon,
  stepNumber,
  title,
  description,
  className,
}: StepCardProps) {
  return (
    <Card className={cn("relative p-8", className)}>
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
        <Icon className="h-6 w-6 text-accent" />
      </div>
      <div className="absolute -top-3 left-6 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
        {stepNumber}
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </Card>
  );
}
