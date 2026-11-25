# Prompt 7: Startseite und Navigation (umgesetzt)

> **Status: umgesetzt** (Commit `935fb90`). Lint, TypeScript, Build und Playwright (13 bestanden, 1 übersprungen) sind grün.

## Umsetzungsstand

- Startseite mit den zehn Bereichen aus dem Prompt (Hero, Suche, Anbieter, Score, Bewertungen, Operational Quality, Kartenvorschau, Vorteile Nutzer und Unternehmen, Footer).
- Navigation mit Anker auf Abschnitte der Startseite. Login und Registrierung im Header.
- Demo-Daten in `lib/demo-data.ts`, jeweils mit Badge "Demo-Daten" und ohne Scores.
- Suche filtert nur Demo-Daten (Client-Filter).
- Karte per `next/dynamic` ohne SSR eingebunden.

## Offen aus Prompt 7

- Visuelle Prüfung der Startseite durch den Nutzer.
- Nicht genutzte Komponenten `components/hero.tsx` und `components/tutorial/` entfernen oder behalten (Entscheidung ausstehend).

Der ursprüngliche Entwurf folgt unverändert darunter.

---

# Prompt 7: Startseite, Suche und Ausbaupfad (Konzept, ursprünglicher Entwurf)

> Dieser Entwurf basierte auf einer Zusammenfassung. Der Originaltext ist in der Umsetzung berücksichtigt.

## Ziel

Öffentliche Einstiegspunkte für MOVORA definieren: Startseite und Suche von Anbietern, Verkehrsmitteln, Linien und Haltestellen. Die Umsetzung erfolgt schrittweise. Dieser Schritt ist nur Planung.

## Geltungsbereich dieses Schritts

- Startseite mit Einstieg in Suche, Anmeldung und Registrierung.
- Suche über Anbieter, Verkehrsmittel, Linien und Haltestellen.
- Öffentlich lesbar, ohne Anmeldung. Bewertungen bleiben für angemeldete Nutzer.
- Keine Schemaänderungen in diesem Schritt. Benötigte Tabellen stehen in [DATABASE_MODEL.md](./DATABASE_MODEL.md).

## Abhängigkeiten

| Bereich | Dokument | Bedeutung für Prompt 7 |
| --- | --- | --- |
| Datenbank | [DATABASE_MODEL.md](./DATABASE_MODEL.md) | Entitäten für die Suche |
| Zugriffsrechte | [RLS_POLICY_PLAN.md](./RLS_POLICY_PLAN.md) | Öffentliche Lesezugriffe nur auf freigegebene Felder |
| Bewertungen | [SCORING_ENGINE.md](./SCORING_ENGINE.md) | Anzeige von Scores mit Stichprobengröße und Datenstand |
| Mobilitätsdaten | [MOBILITY_DATA_PLAN.md](./MOBILITY_DATA_PLAN.md) | Haltestellen und Linien kommen aus GTFS |

## Regeln

- Fehlende Daten werden nicht als schlechte Bewertung dargestellt.
- Scores werden nur mit Stichprobengröße und Datenstand angezeigt.
- Keine geschützten Inhalte auf öffentlichen Seiten.
- Keine Emojis als Icons. Icons über `lucide-react`.
- Designtokens aus `app/globals.css`, keine festen Farbwerte.

## Offene Punkte

- Originaltext von Prompt 7 abgleichen.
- Suchtechnik festlegen: Datenbankabfrage mit PostgreSQL-Volltextsuche oder PostGIS für Umkreissuche.
- Umfang der Startseite festlegen, zum Beispiel Hero-Bereich und Kurzsuche.
- Abnahmekriterien mit Playwright-Tests festlegen, sobald Code entsteht.

## Nicht Bestandteil dieses Schritts

- Stripe-Zahlungen (Prompts später).
- B2B-Dashboard und Admin-Oberfläche.
- Android-Anbindung über Ionic und Capacitor.
