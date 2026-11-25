---
name: open-source-integration
description: Bewertung und Integration bestehender Open-Source-Projekte für MOVORA (Supabase Starter, shadcn/ui, Next.js SaaS Starter, MapLibre, GTFS Validator, Capacitor). Verwenden vor jeder neuen Abhängigkeit oder Übernahme fremden Codes.
---

# Open-Source-Integration

## Wann einsetzen
- Vor dem Hinzufügen einer neuen Bibliothek oder eines Starters.
- Vor dem Kopieren von Code oder Dateien aus fremden Repositories.
- Bei der Prüfung, ob eine Funktion bereits vorhanden ist.

## Zuerst lesen
1. [docs/OPEN_SOURCE_COMPONENTS.md](../../../docs/OPEN_SOURCE_COMPONENTS.md) (bisherige Integrationen und offene Punkte).
2. [package.json](../../../package.json) (bereits installierte Abhängigkeiten).

## Fachliche Regeln
- Erst prüfen, ob MOVORA-Code oder eine vorhandene Abhängigkeit die Funktion schon abdeckt.
- Prüfen: Lizenz, letzte Aktivität, Sicherheitslage, Abhängigkeiten, Dokumentation, Aufwand.
- Bevorzugt offizielle Projekte.
- Keine doppelten Frameworks, Datenbanken oder UI-Bibliotheken.
- Fremden Code nur übernehmen, wenn die Lizenz es erlaubt. Herkunft im Code oder in der Dokumentation nennen.
- Jede Integration wird in `docs/OPEN_SOURCE_COMPONENTS.md` eingetragen.
- Den Next.js SaaS Starter nicht komplett kopieren (PostgreSQL und Drizzle passen nicht zu Supabase).

## Arbeitsablauf
1. Bedarf und bestehende Lösung vergleichen.
2. Quelle prüfen (Lizenz, Wartung, Abhängigkeiten).
3. Kleinsten Umfang wählen: Paket, Komponente oder Konzept.
4. Integrieren, anpassen, testen.
5. Dokumentation aktualisieren.

## Bibliotheken und Werkzeuge
npm, `npm view <paket>` für Metadaten, Lizenzprüfung über `package.json` und das Repository.

## Sicherheitsregeln
- Neue Pakete nur aus bekannten Registries. Versionen festpinnen über das Lockfile.
- Keine Skripte aus fremden Repositories ungeprüft ausführen.

## Typische Fehler
- Ganzes Starter-Projekt kopiert, Konflikte bei Auth und Datenbank.
- Zwei Bibliotheken für dieselbe Aufgabe.
- Lizenz nicht geprüft (z. B. GPL in proprietärem Code).
- Dokumentation nicht aktualisiert.

## Qualitätskontrolle
- Lizenz und Wartungszustand notiert.
- Build läuft nach der Integration.

## Definition of Done
- Entscheidung und Quelle in `docs/OPEN_SOURCE_COMPONENTS.md` dokumentiert.
- Keine doppelte Abhängigkeit eingeführt.
- Build und Lint grün.
