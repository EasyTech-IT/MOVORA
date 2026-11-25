---
name: performance-and-scaling
description: Performance und Skalierung für MOVORA: Ladezeiten, Datenbankabfragen und Indizes, Karten mit vielen Haltestellen, Caching und Lasttests. Verwenden bei Performance-Problemen oder bei Datenmengen, die wachsen.
---

# Performance und Skalierung

## Wann einsetzen
- Langsame Seiten, Karten oder Abfragen.
- Große Datenimporte (GTFS, Verspätungen).
- Vor dem Launch oder bei steigender Nutzerzahl.

## Zuerst lesen
1. [supabase-database-engineering](../supabase-database-engineering/SKILL.md) für Indizes und Abfragen.
2. [mobility-data-engineering](../mobility-data-engineering/SKILL.md) für Datenmengen.

## Fachliche Regeln
- Erst messen, dann optimieren. Ohne Messwert keine Änderung.
- Karten: Haltestellen und Routen nach Kartenausschnitt und Zoomstufe laden, nie alles auf einmal.
- Datenbank: Indizes für Filter- und Geo-Abfragen (PostGIS mit GIST), Abfragen auf benötigte Spalten begrenzen.
- Cache nur für öffentliche, nicht personenbezogene Daten mit klarer Aktualisierungsregel.
- Echtzeitdaten (Verspätungen) mit Datenstand kennzeichnen, damit alte Werte nicht als aktuell erscheinen.

## Arbeitsablauf
1. Engpass messen (Browser-Performance, Abfrageplan mit `EXPLAIN ANALYZE`, Importdauer).
2. Ursache benennen und die kleinste wirksame Änderung wählen.
3. Vorher-nachher-Messung dokumentieren.
4. Lasttest nur mit Testdaten und nach Freigabe.

## Sicherheitsregeln
- Keine Produktionsdatenbank für Lasttests verwenden.
- Caches dürfen keine Berechtigungsprüfung umgehen.
- Fehlermeldungen bei Überlast geben keine internen Details preis.

## Typische Fehler
- Alle Haltestellen werden geladen und die Karte friert ein.
- Fehlender Index auf einer häufig gefilterten Spalte.
- Veraltete Echtzeitwerte werden ohne Zeitstempel angezeigt.

## Qualitätskontrolle
- `npm run build` und Lint grün.
- Messwerte vorher und nachher im Pull-Request-Text.

## Definition of Done
- Engpass gemessen, Änderung belegt, keine Berechtigungen umgangen, Datenstand sichtbar.
