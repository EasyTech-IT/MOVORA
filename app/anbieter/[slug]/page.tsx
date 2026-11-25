import { DemoBadge } from "@/components/movora/demo-badge";
import { SiteFooter } from "@/components/movora/site-footer";
import { SiteHeader } from "@/components/movora/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DEMO_PROVIDERS, type DemoProvider } from "@/lib/demo-data";
import { findProviderBySlug } from "@/lib/provider-search";
import { notFound } from "next/navigation";
import { Suspense } from "react";

const NO_DATA = "Noch nicht ausreichend Daten";

export function generateStaticParams() {
  return DEMO_PROVIDERS.map((provider) => ({ slug: provider.slug }));
}

export default function AnbieterProfilPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-10">
        <Suspense fallback={<p className="text-sm text-muted-foreground">Profil wird geladen …</p>}>
          <ProviderProfile params={params} />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}

async function ProviderProfile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const provider = findProviderBySlug(slug);
  if (!provider) notFound();

  return <ProviderDetails provider={provider} />;
}

function ProviderDetails({ provider }: { provider: DemoProvider }) {
  const initials = provider.name
    .split(/\s+/)
    .filter((word) => /^[A-Za-zÄÖÜäöüß]/.test(word))
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <>
        <div className="flex items-center gap-4">
          <div aria-hidden="true" className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary text-lg font-semibold text-primary-foreground">
            {initials}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {provider.isDemo ? <DemoBadge /> : null}
              <span className="text-xs text-muted-foreground">{provider.category}</span>
            </div>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">{provider.name}</h1>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Stammdaten</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p>Kategorie: {provider.category}</p>
              <p>Betriebsgebiet: {provider.region}</p>
              <p>Verkehrsmittel: {provider.transport.join(", ")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Datenquellen und Aktualität</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p>Datenquelle: Keine (Demo-Eintrag)</p>
              <p>Letzte Aktualisierung: Keine Daten</p>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">MOVORA-Scores</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm sm:grid-cols-3">
              <p>
                <span className="block text-muted-foreground">MOVORA Overall Score</span>
                {NO_DATA}
              </p>
              <p>
                <span className="block text-muted-foreground">Community Score</span>
                {NO_DATA}
              </p>
              <p>
                <span className="block text-muted-foreground">Operational Score</span>
                {NO_DATA}
              </p>
              <p className="sm:col-span-3">
                <span className="block text-muted-foreground">Anzahl der Bewertungen</span>
                0 Bewertungen
              </p>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Score-Verlauf und Nutzerbewertungen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Score-Verlauf: {NO_DATA}.</p>
              <p>Noch keine Nutzerbewertungen vorhanden.</p>
            </CardContent>
          </Card>
        </div>
    </>
  );
}
