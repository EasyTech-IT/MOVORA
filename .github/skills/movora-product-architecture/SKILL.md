---
name: movora-product-architecture
description: MOVORA-Gesamtarchitektur, Produktbereiche, B2C/B2B, Benutzerrollen, Module und Schnittstellen. Verwenden, wenn eine neue Funktion geplant oder die Projektstruktur verändert wird.
---

# MOVORA Product Architecture

## Wann einsetzen
- Neue Funktion, neues Modul oder neue Seite soll geplant werden.
- Frage, wo Code, Daten oder Logik hingehört.
- Entscheidung zwischen Server Component, Client Component, Route Handler oder Supabase-Funktion.

## Zuerst lesen
1. [README.md](../../../README.md)
2. [docs/OPEN_SOURCE_COMPONENTS.md](../../../docs/OPEN_SOURCE_COMPONENTS.md)
3. [AGENTS.md](../../../AGENTS.md) und [.github/copilot-instructions.md](../../copilot-instructions.md)
4. Vorhandene Struktur: `app/`, `components/`, `lib/`, `proxy.ts`.

## Fachliche Regeln
- MOVORA ist eine Mobilitätsplattform. Zielgruppen: B2C (Nutzer) und B2B (Anbieter, Verkehrsunternehmen).
- Rollen (Zielbild): Gast, Nutzer, Anbieter, Administrator. Rollen werden serverseitig geprüft, nie nur in der Oberfläche.
- Supabase ist die zentrale Datenbank- und Authentifizierungsplattform. Kein zweiter Datenbankserver.
- Module trennen: Auth, Karten, Mobilitätsdaten, Bewertungen (Scoring), Abonnements, Admin.
- Neue Funktionen müssen in diese Struktur passen. Bestehende Lösungen zuerst wiederverwenden.

## Arbeitsablauf
1. Bestehende Dateien und Muster suchen.
2. Betroffene Module und Datenflüsse benennen.
3. Kurzplan erstellen und Konflikte mit Auth, Datenbank oder Zahlungen prüfen.
4. Erst dann implementieren, mit passendem Fach-Skill.

## Bibliotheken und Werkzeuge
Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui, Supabase, MapLibre GL JS.

## Sicherheitsregeln
- Keine Geschäftslogik nur im Client. Prüfungen gehören auf den Server oder in die Datenbank (RLS).
- Keine Secrets im Code.

## Typische Fehler
- Parallele Auth-Systeme oder zweite UI-Bibliothek einführen.
- Logik in Komponenten statt in `lib/` ablegen.
- Rollen nur über Oberflächen-Sichtbarkeit steuern.

## Qualitätskontrolle
- `npm run lint` und `npm run build` laufen fehlerfrei.
- Neue Module sind in der Architekturdokumentation erwähnt.

## Definition of Done
- Die Funktion passt in die Modulstruktur und nutzt vorhandene Komponenten.
- Rollen- und Datenzugriff sind serverseitig geprüft.
- Build und Lint sind grün, Änderung ist dokumentiert.
