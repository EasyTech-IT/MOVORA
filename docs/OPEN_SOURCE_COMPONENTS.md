# MOVORA – Open-Source-Komponenten

Dieses Dokument listet alle verwendeten Open-Source-Projekte, deren Lizenzen, Herkunft und Integrationsstatus.

## Integrierte Repositories und Bibliotheken

| Komponente | Herkunft | Lizenz | Status | Integrierte Funktionen |
|---|---|---|---|---|
| Supabase Next.js Starter (`with-supabase`) | [vercel/next.js examples](https://github.com/vercel/next.js/tree/canary/examples/with-supabase) (offizielles Supabase-Template) | MIT | ✅ Integriert | Next.js (App Router), Supabase-Anbindung (`@supabase/ssr`, `@supabase/supabase-js`), kompletter Auth-Flow (Login, Registrierung, Passwort vergessen/ändern, E-Mail-Bestätigung), geschützte Routen (`app/protected`), Cookie-basierte SSR-Authentifizierung (`proxy.ts`, `lib/supabase`), Tailwind CSS, Dark Mode (`next-themes`) |
| shadcn/ui | [shadcn-ui/ui](https://github.com/shadcn-ui/ui) | MIT | ✅ Integriert | Komponenten in `components/ui`: badge, button, card, checkbox, dropdown-menu, input, label, dialog, table, tabs, select. Weitere Komponenten bei Bedarf: `npx shadcn@latest add <name>` |
| MapLibre GL JS | [maplibre/maplibre-gl-js](https://github.com/maplibre/maplibre-gl-js) | BSD-3-Clause | 🟡 Vorbereitet | `maplibre-gl` als Dependency installiert, wiederverwendbare Kartenkomponente unter `components/map.tsx`. Noch nicht in Seiten eingebunden. |
| Tailwind CSS | [tailwindlabs/tailwindcss](https://github.com/tailwindlabs/tailwindcss) | MIT | ✅ Integriert | Design-/Utility-System, Basis für shadcn/ui |
| Radix UI | [radix-ui/primitives](https://github.com/radix-ui/primitives) | MIT | ✅ Integriert (via shadcn/ui) | Barrierefreie Primitives für Dialog, Dropdown, Tabs, Select, Checkbox, Label |
| lucide-react | [lucide-icons/lucide](https://github.com/lucide-icons/lucide) | ISC | ✅ Integriert | Icon-Bibliothek |

## Noch offene Integrationen

| Komponente | Herkunft | Lizenz | Geplanter Einsatz |
|---|---|---|---|
| Next.js SaaS Starter (nur Konzepte/Stripe-Logik) | [nextjs/saas-starter](https://github.com/nextjs/saas-starter) | MIT | Stripe Checkout, Abos, Kundenportal, Rollen/Teams. **Nicht kopieren** – verwendet Drizzle statt Supabase; nur Stripe-Muster übernehmen und an Supabase anpassen. |
| MobilityData GTFS Validator | [MobilityData/gtfs-validator](https://github.com/MobilityData/gtfs-validator) | Apache-2.0 | Validierung von Fahrplandaten (GTFS), sobald MOVORA Mobilitätsdaten verarbeitet. Java-Tool, Einsatz als CLI/CI-Schritt. |
| Ionic Capacitor Starters | [ionic-team/capacitor-starters](https://github.com/ionic-team/capacitor-starters) | MIT | Android-App-Grundgerüst, sobald die Web-Basis stabil ist. |
| Playwright | [microsoft/playwright](https://github.com/microsoft/playwright) | Apache-2.0 | End-to-End-Tests. |

## Technische Anpassungen

- Das Starter-Template wurde kontrolliert in das bestehende MOVORA-Repository integriert; die Git-Historie blieb erhalten.
- `components/map.tsx` wurde als MOVORA-eigene MapLibre-Wrapper-Komponente erstellt (Client Component, Demo-Style von [demotiles.maplibre.org](https://demotiles.maplibre.org)).
- Supabase-Zugangsdaten werden über `.env.local` konfiguriert (siehe `.env.example`); keine Secrets im Repository.

## Wartungs- und Sicherheitshinweise

- `npm audit` zum Zeitpunkt der Integration: 0 bekannte Schwachstellen.
- `@supabase/ssr` und `@supabase/supabase-js` sind auf `latest` gepinnt → vor Produktivbetrieb auf feste Versionen festlegen.
- shadcn/ui-Komponenten werden in das Repo kopiert (kein npm-Paket) → Updates manuell über die shadcn-CLI.
- MapLibre-Styles/Tiles: Für den Produktivbetrieb eigenen Tile-Server oder Anbieter (z. B. MapTiler, OpenFreeMap) mit passender Lizenz wählen; OSM-Attribution beachten.

## KI-Skills und Projektregeln

Die Nutzung der Bausteine ist in Skills beschrieben: [docs/AI_SKILLS.md](./AI_SKILLS.md). Der Skill [open-source-integration](../.github/skills/open-source-integration/SKILL.md) legt fest, wie neue Repositories geprüft und hier eingetragen werden.
