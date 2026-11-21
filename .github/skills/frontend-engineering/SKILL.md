---
name: frontend-engineering
description: Next.js App Router, React, TypeScript, Tailwind und shadcn/ui für MOVORA. Verwenden bei Seiten, Komponenten, Formularen, State, Responsive Design und Barrierefreiheit.
---

# Frontend Engineering

## Wann einsetzen
- Neue oder geänderte Seiten unter `app/`.
- Komponenten, Formulare, Tabellen, Dialoge.
- Responsive Anpassungen für Smartphone, Tablet, Laptop und Desktop.

## Zuerst lesen
1. [AGENTS.md](../../../AGENTS.md). Die Next.js-Version hat Breaking Changes. Die Docs in `node_modules/next/dist/docs/` lesen.
2. [components/](../../../components) und `components/ui/` (vorhandene Bausteine).
3. [next.config.ts](../../../next.config.ts) und [tsconfig.json](../../../tsconfig.json).

## Fachliche Regeln
- Standardmäßig Server Components. `"use client"` nur, wenn Zustand, Events oder Browser-APIs nötig sind.
- Vorhandene shadcn-Komponenten zuerst verwenden. Keine doppelte Implementierung.
- Formulare mit Server Actions oder Route Handlers, serverseitig validieren.
- Responsive: mobil zuerst, dann `sm:`, `md:`, `lg:`.
- Barrierefreiheit: Labels, Fokusreihenfolge, `aria`-Attribute bei Dialogen und Menüs.
- Keine Emoji als UI-Icons.
- Neue Abhängigkeiten nur nach Prüfung (siehe Skill `open-source-integration`).

## Arbeitsablauf
1. Route und Komponentenbaum planen.
2. Bestehende Bausteine suchen.
3. Server oder Client Component entscheiden.
4. Umsetzen, dann `npm run lint` und `npm run build`.
5. Responsive und Tastaturbedienung prüfen.

## Bibliotheken und Werkzeuge
Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, MapLibre GL JS (`components/map.tsx`).

## Sicherheitsregeln
- Keine sensiblen Daten in Client Components übergeben.
- Keine `dangerouslySetInnerHTML` mit Nutzerinhalt.
- Umgebungsvariablen ohne `NEXT_PUBLIC_`-Präfix nie im Client verwenden.

## Typische Fehler
- `"use client"` auf jeder Seite, dadurch großes Bundle.
- Eigene Komponente neben vorhandener shadcn-Komponente.
- Fehlende Ladezustände und Fehlermeldungen.
- Nur Desktop getestet.

## Qualitätskontrolle
- Lint, TypeScript und Build laufen fehlerfrei.
- Tastatur- und Mobilansicht geprüft.

## Definition of Done
- Seite oder Komponente funktioniert in allen Breakpoints.
- Vorhandene Bausteine wiederverwendet.
- Build und Lint grün.
