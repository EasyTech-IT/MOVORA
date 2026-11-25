import { ProviderCard } from "@/components/movora/provider-card";
import { SiteFooter } from "@/components/movora/site-footer";
import { SiteHeader } from "@/components/movora/site-header";
import { Button } from "@/components/ui/button";
import { getFilterOptions, searchProviders, type ProviderSearchParams } from "@/lib/provider-search";
import Link from "next/link";
import { Suspense } from "react";

export const metadata = {
  title: "Entdecken | MOVORA",
  description: "Mobilitätsanbieter, Linien und Regionen durchsuchen. Alle Angaben sind Demo-Daten.",
};

const selectClass =
  "h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function buildHref(params: ProviderSearchParams, page: number) {
  const query = new URLSearchParams();
  if (params.q) query.set("q", params.q);
  if (params.verkehrsmittel) query.set("verkehrsmittel", params.verkehrsmittel);
  if (params.region) query.set("region", params.region);
  if (page > 1) query.set("seite", String(page));
  const suffix = query.toString();
  return suffix ? `/entdecken?${suffix}` : "/entdecken";
}

export default function EntdeckenPage({ searchParams }: { searchParams: Promise<ProviderSearchParams> }) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-10">
        <h1 className="text-3xl font-semibold tracking-tight">Entdecken</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Alle Angaben auf dieser Seite sind Demo-Daten. Es werden keine Scores angezeigt.
        </p>
        <Suspense fallback={<p className="mt-6 text-sm text-muted-foreground">Suche wird geladen …</p>}>
          <SearchResults searchParams={searchParams} />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}

async function SearchResults({ searchParams }: { searchParams: Promise<ProviderSearchParams> }) {
  const params = await searchParams;
  const result = searchProviders(params);
  const { transports, regions } = getFilterOptions();
  const q = params.q?.slice(0, 100) ?? "";

  return (
    <>
      <form method="get" action="/entdecken" className="mt-6 grid gap-3 md:grid-cols-[1fr_auto_auto_auto]">
          <label htmlFor="suche-q" className="sr-only">
            Anbieter, Linie, Region oder Stadt suchen
          </label>
          <input
            id="suche-q"
            name="q"
            type="search"
            defaultValue={q}
            maxLength={100}
            placeholder="Anbieter, Linie, Region oder Stadt"
            className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <label htmlFor="suche-verkehrsmittel" className="sr-only">
            Verkehrsmittel
          </label>
          <select id="suche-verkehrsmittel" name="verkehrsmittel" defaultValue={params.verkehrsmittel ?? ""} className={selectClass}>
            <option value="">Alle Verkehrsmittel</option>
            {transports.map((transport) => (
              <option key={transport} value={transport}>
                {transport}
              </option>
            ))}
          </select>
          <label htmlFor="suche-region" className="sr-only">
            Region
          </label>
          <select id="suche-region" name="region" defaultValue={params.region ?? ""} className={selectClass}>
            <option value="">Alle Regionen</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
          <Button type="submit">Suchen</Button>
        </form>

        <p aria-live="polite" className="mt-6 text-sm text-muted-foreground">
          {result.total === 0
            ? "Keine Demo-Ergebnisse gefunden."
            : `${result.total} Demo-Ergebnis${result.total === 1 ? "" : "se"}, Seite ${result.page} von ${result.pageCount}`}
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {result.items.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>

        {result.pageCount > 1 ? (
          <nav aria-label="Seitennavigation" className="mt-8 flex items-center justify-between text-sm">
            {result.page > 1 ? (
              <Link href={buildHref(params, result.page - 1)} className="text-primary hover:underline">
                Zurück
              </Link>
            ) : (
              <span />
            )}
            {result.page < result.pageCount ? (
              <Link href={buildHref(params, result.page + 1)} className="text-primary hover:underline">
                Weiter
              </Link>
            ) : (
              <span />
            )}
          </nav>
        ) : null}
    </>
  );
}
