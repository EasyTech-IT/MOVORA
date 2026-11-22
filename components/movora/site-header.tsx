import { AuthButton } from "@/components/auth-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { Suspense } from "react";
import Link from "next/link";
import { hasEnvVars } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Startseite" },
  { href: "#suche", label: "Entdecken" },
  { href: "#anbieter", label: "Anbieter" },
  { href: "#bewertungen", label: "Bewertungen" },
  { href: "#unternehmen", label: "Für Unternehmen" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-4 px-5">
        <Link href="/" className="text-lg font-semibold tracking-tight text-primary">
          MOVORA
        </Link>
        <nav aria-label="Hauptnavigation" className="hidden items-center gap-5 text-sm md:flex">
          {NAV_ITEMS.map((item) => (
            <a key={item.label} href={item.href} className="text-muted-foreground transition-colors hover:text-foreground">
              {item.label}
            </a>
          ))}
        </nav>
        {!hasEnvVars ? (
          <EnvVarWarning />
        ) : (
          <Suspense>
            <AuthButton />
          </Suspense>
        )}
      </div>
      <nav aria-label="Mobile Navigation" className="flex gap-4 overflow-x-auto border-t px-5 py-2 text-sm md:hidden">
        {NAV_ITEMS.map((item) => (
          <a key={item.label} href={item.href} className="shrink-0 text-muted-foreground hover:text-foreground">
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
