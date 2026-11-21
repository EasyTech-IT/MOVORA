---
name: mobility-data-engineering
description: Mobilitätsdaten wie GTFS, GTFS-Realtime, Mobilithek, DELFI, Haltestellen, Routen, Verspätungen und Geodaten. Verwenden bei Datenimporten, Validierung und Datenquellen.
---

# Mobility Data Engineering

## Wann einsetzen
- Import oder Verarbeitung von Fahrplan- oder Echtzeitdaten.
- Validierung von GTFS-Feeds.
- Auswahl oder Prüfung einer Datenquelle und ihrer Lizenz.

## Zuerst lesen
1. [docs/OPEN_SOURCE_COMPONENTS.md](../../../docs/OPEN_SOURCE_COMPONENTS.md) (Tabelle der Open-Source-Komponenten, Validatoren).
2. Lizenz und Nutzungsbedingungen der Datenquelle.
3. Vorhandene Karten- und Datenkomponenten (`components/map.tsx`).

## Fachliche Regeln
- Validierung nach Format: GTFS Schedule mit dem MobilityData GTFS Validator; GTFS-Realtime mit dem MobilityData GTFS-Realtime Validator; GBFS mit dem MobilityData GBFS Validator; Geodaten per GeoJSON-Schema oder PostGIS-Constraints. Keine eigenen Parser für die Validierung.
- Jede Datenquelle hat Lizenz, Herkunft, Aktualisierungsintervall und Stand dokumentiert.
- Rohdaten bleiben unverändert. Transformationen sind nachvollziehbar.
- Fehlende oder veraltete Daten werden als solche angezeigt. Sie sind keine Qualitätsbewertung des Anbieters.
- Echtzeitdaten mit Zeitstempel und Veraltungsgrenze speichern.
- Keine Daten übernehmen, deren Lizenz nicht geklärt ist.

## Arbeitsablauf
1. Quelle, Lizenz und Format bestimmen (GTFS, GTFS-RT, GBFS, Geodaten).
2. Feed mit dem passenden Validator prüfen (siehe Regeln oben) und Bericht speichern.
3. Import in Supabase über versionierte Migration oder Edge Function.
4. Geodaten als PostGIS-Geometrien speichern.
5. Stichprobe prüfen: Anzahl Haltestellen, Routen, Zeitbereich.

## Bibliotheken und Werkzeuge
MobilityData Validatoren für GTFS Schedule, GTFS-Realtime und GBFS (Lizenz und Version vor Einsatz prüfen), MapLibre GL JS (BSD-3-Clause), PostGIS.

## Sicherheitsregeln
- Importskripte nur mit geprüften Quellen-URLs. Keine beliebigen URLs aus Nutzereingaben laden.
- API-Schlüssel für Mobilitätsquellen nur als Umgebungsvariable.
- Große Importe mit Zeitlimit und Fehlerbehandlung ausführen.

## Typische Fehler
- Eigener GTFS-Parser statt bestehendem Validator.
- Zeitzonen bei Fahrplänen falsch behandelt (GTFS-Zeiten können über 24:00 liegen).
- Lizenz einer Quelle nicht geprüft.
- Doppelte Haltestellen durch fehlende Eindeutigkeit beim Import.

## Qualitätskontrolle
- Validator-Bericht des jeweiligen Formats ohne kritische Fehler.
- Stichprobenprüfung auf der Karte.

## Definition of Done
- Quelle mit Lizenz und Stand dokumentiert.
- Validierung ausgeführt, Ergebnis dokumentiert.
- Import wiederholbar und getestet.
