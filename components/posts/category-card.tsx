import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface CategoryCardProps {
  href: string;
  title: string;
  description: string;
  className?: string;
}

export function CategoryCard({
  href,
  title,
  description,
  className,
}: CategoryCardProps) {
  return (
    <Link href={href}>
      <Card
        className={cn(
          "group relative overflow-hidden p-8 transition-colors hover:border-accent/50",
          className
        )}
      >
        <div className="relative z-10">
          <h3 className="mb-2 text-xl font-semibold">{title}</h3>
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-accent">
            View products
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
        <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-full bg-accent/5 transition-transform group-hover:scale-150" />
      </Card>
    </Link>
  );
}
