import type { LucideIcon } from "lucide-react";

export function PageHeader({
  icon: Icon, eyebrow, title, description,
}: { icon: LucideIcon; eyebrow: string; title: string; description: string }) {
  return (
    <div className="mb-8 animate-fade-up">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-primary mb-3">
        <Icon className="h-4 w-4" />
        {eyebrow}
      </div>
      <h1 className="font-display text-3xl md:text-4xl font-bold gradient-text mb-2">{title}</h1>
      <p className="text-muted-foreground max-w-2xl">{description}</p>
    </div>
  );
}
