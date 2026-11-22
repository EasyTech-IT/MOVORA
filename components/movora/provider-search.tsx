"use client";

import { Input } from "@/components/ui/input";
import { DEMO_PROVIDERS } from "@/lib/demo-data";
import { useMemo, useState } from "react";
import { ProviderCard } from "./provider-card";

export function ProviderSearch() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return DEMO_PROVIDERS;
    return DEMO_PROVIDERS.filter((provider) =>
      [provider.name, provider.category, provider.region, ...provider.transport]
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [query]);

  return (
    <div className="flex flex-col gap-6">
      <label htmlFor="provider-search" className="sr-only">
        Anbieter, Linien oder Regionen suchen
      </label>
      <Input
        id="provider-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Anbieter, Linie, Region oder Stadt suchen"
        className="h-12 text-base"
        autoComplete="off"
      />
      <p aria-live="polite" className="text-sm text-muted-foreground">
        {results.length === 0
          ? "Keine Demo-Ergebnisse gefunden."
          : `${results.length} Demo-Ergebnis${results.length === 1 ? "" : "se"}`}
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        {results.map((provider) => (
          <ProviderCard key={provider.id} provider={provider} />
        ))}
      </div>
    </div>
  );
}
