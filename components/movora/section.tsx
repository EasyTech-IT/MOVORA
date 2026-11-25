import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type SectionProps = {
  id: string;
  title: string;
  eyebrow?: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function Section({ id, title, eyebrow, description, children, className }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn("w-full scroll-mt-20 px-5 py-16 md:py-24", className)}
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <header className="flex max-w-2xl flex-col gap-3">
          {eyebrow ? (
            <p className="text-sm font-semibold uppercase tracking-wide text-accent-foreground">
              {eyebrow}
            </p>
          ) : null}
          <h2 id={`${id}-title`} className="text-3xl font-semibold tracking-tight md:text-4xl">
            {title}
          </h2>
          {description ? <p className="text-muted-foreground md:text-lg">{description}</p> : null}
        </header>
        {children}
      </div>
    </section>
  );
}
