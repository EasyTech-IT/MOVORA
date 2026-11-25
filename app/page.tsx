import { Activity, BarChart3, Building2, Bus, Gauge, Map, Search, ShieldCheck, TrainFront, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoCard } from "@/components/movora/info-card";
import { MapPreview } from "@/components/movora/map-preview";
import { ProviderSearch } from "@/components/movora/provider-search";
import { Section } from "@/components/movora/section";
import { SiteFooter } from "@/components/movora/site-footer";
import { SiteHeader } from "@/components/movora/site-header";

const ENTRANCE = "animate-in fade-in slide-in-from-bottom-4 duration-700 motion-reduce:animate-none";

const PROVIDER_CATEGORIES = [
  { title: "Verkehrsverbünde", description: "Regionale Verbünde mit Bus, Bahn und Straßenbahn.", icon: Bus },
  { title: "Regionalverkehr", description: "Regionalzüge und Verbindungen zwischen Städten.", icon: TrainFront },
  { title: "Stadtverkehr", description: "Stadtbusse, U-Bahnen und Straßenbahnen.", icon: Map },
];

export default function Home() {
  return (
    <div id="top" className="flex min-h-screen w-full flex-col items-center">
      <SiteHeader />
      <main className="flex w-full flex-1 flex-col">
        <section aria-labelledby="hero-title" className="w-full px-5 pb-16 pt-16 md:pb-24 md:pt-28">
          <div className={`mx-auto flex max-w-3xl flex-col gap-6 text-center ${ENTRANCE}`}>
            <p className="text-sm font-semibold uppercase tracking-wide text-accent-foreground">
              Mobilitätsqualität
            </p>
            <h1 id="hero-title" className="text-4xl font-semibold tracking-tight text-primary md:text-6xl">
              Was ist MOVORA?
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              MOVORA macht Mobilitätsqualität transparent und vergleichbar.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <a href="#suche">Anbieter suchen</a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#unternehmen">Für Unternehmen</a>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Die Anbieter und Karten auf dieser Seite sind Demo-Daten.
            </p>
          </div>
        </section>

        <Section
          id="suche"
          eyebrow="Entdecken"
          title="Anbieter, Linien und Regionen finden"
          description="Suche nach Anbieter, Verkehrsmittel, Region oder Stadt."
        >
          <ProviderSearch />
        </Section>

        <Section
          id="anbieter"
          eyebrow="Anbieter"
          title="Beliebte Mobilitätsanbieter"
          description="Noch sind keine echten Anbieterprofile angelegt. Sobald Daten aus geprüften Quellen vorliegen, erscheinen sie hier."
        >
          <div className="grid gap-4 md:grid-cols-3">
            {PROVIDER_CATEGORIES.map((category) => (
              <InfoCard key={category.title} icon={category.icon} title={category.title} description={category.description} />
            ))}
          </div>
        </Section>

        <Section
          id="score"
          eyebrow="MOVORA Score"
          title="So entsteht der MOVORA Score"
          description="Der Overall Score setzt sich aus zwei Teilwerten zusammen. Ein Score wird nur angezeigt, wenn genug Daten vorliegen."
        >
          <div className="grid gap-4 md:grid-cols-3">
            <InfoCard
              icon={Users}
              title="Community Score"
              description="Bewertungen von Nutzerinnen und Nutzern, mit Mindestanzahl und Gewichtung."
            />
            <InfoCard
              icon={Activity}
              title="Operational Score"
              description="Betriebsdaten wie Pünktlichkeit und Ausfälle aus Mobilitätsdatenquellen."
            />
            <InfoCard
              icon={ShieldCheck}
              title="Overall Score"
              description="Verbindet beide Teilwerte und zeigt zusätzlich Datenqualität und Aktualität."
            />
          </div>
        </Section>

        <Section
          id="bewertungen"
          eyebrow="Community"
          title="Bewertungen von Fahrgästen"
          description="Nutzerinnen und Nutzer bewerten Anbieter nach festen Kriterien. Negative Bewertungen werden nicht ausgeblendet; Meldungen werden geprüft."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <InfoCard
              icon={Users}
              title="Bewertungen an Fahrten gebunden"
              description="Die Bewertung soll auf einer erlebten Fahrt beruhen. Dieses Verfahren wird mit der Datenbankarchitektur umgesetzt."
            />
            <InfoCard
              icon={ShieldCheck}
              title="Geprüfte Meldungen"
              description="Auffällige Inhalte werden moderiert, legitime Kritik bleibt sichtbar."
            />
          </div>
        </Section>

        <Section
          id="betrieb"
          eyebrow="Operational Quality"
          title="Betriebsqualität auf Basis offener Daten"
          description="Fahrplan- und Echtzeitdaten werden auf Vollständigkeit und Aktualität geprüft, bevor sie in Scores einfließen."
        >
          <div className="grid gap-4 md:grid-cols-3">
            <InfoCard icon={Activity} title="Pünktlichkeit" description="Abweichungen gegenüber dem Fahrplan." />
            <InfoCard icon={Gauge} title="Ausfälle" description="Entfallene Fahrten im Berichtszeitraum." />
            <InfoCard icon={BarChart3} title="Datenaktualität" description="Wann die Quelle zuletzt aktualisiert wurde." />
          </div>
        </Section>

        <Section
          id="karte"
          eyebrow="Karte"
          title="Interaktive Karten-Vorschau"
          description="Haltestellen und Linien werden nach der Datenanbindung auf der Karte dargestellt."
        >
          <MapPreview />
        </Section>

        <Section
          id="vorteile-nutzer"
          eyebrow="Für Nutzer"
          title="Verlässlich unterwegs"
          description="Vergleichen statt raten: Qualität von Anbietern und Linien auf einen Blick."
        >
          <div className="grid gap-4 md:grid-cols-3">
            <InfoCard icon={Search} title="Schnell finden" description="Anbieter, Linien und Haltestellen in einer Suche." />
            <InfoCard icon={BarChart3} title="Klar vergleichen" description="Scores mit Datengrundlage und Hinweisen zur Aussagekraft." />
            <InfoCard icon={Users} title="Mitreden" description="Eigene Bewertungen helfen anderen Fahrgästen." />
          </div>
        </Section>

        <Section
          id="unternehmen"
          eyebrow="Für Unternehmen"
          title="Qualität messbar machen"
          description="Verkehrsunternehmen und Analysten erhalten belastbare Kennzahlen, Berichte und Verlaufsdaten."
        >
          <div className="grid gap-4 md:grid-cols-3">
            <InfoCard icon={Building2} title="Transparenz" description="Eigene Scores mit nachvollziehbarer Herleitung." />
            <InfoCard icon={BarChart3} title="Berichte" description="Zeitraumfilter, Vergleiche und Exporte." />
            <InfoCard icon={ShieldCheck} title="Keine Manipulation" description="Scores lassen sich nicht durch Zahlungen beeinflussen." />
          </div>
        </Section>
      </main>
      <SiteFooter />
    </div>
  );
}
