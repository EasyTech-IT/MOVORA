---
name: movora-scoring-engine
description: MOVORA-Bewertungssystem mit Community Score, Operational Score, Overall Score, Datenqualität, Konfidenz und Mindeststichproben. Verwenden bei jeder Berechnung oder Anzeige von Bewertungen.
---

# MOVORA Scoring Engine

## Wann einsetzen
- Berechnung oder Darstellung von Community Score, Operational Score oder Overall Score.
- Gewichtungen, Konfidenzwerte oder Mindeststichproben ändern.
- Bewertungsanzeigen oder Diagramme zu Scores bauen.

## Zuerst lesen
1. Vorhandene Scoring-Logik in `lib/` (falls vorhanden) und deren Tests.
2. [docs/OPEN_SOURCE_COMPONENTS.md](../../../docs/OPEN_SOURCE_COMPONENTS.md) für Datenquellen.
3. Die Datenbankschemata für Bewertungen (siehe Skill `supabase-database-engineering`).

## Fachliche Regeln
- Die vorläufige Gewichtung 40 % Community / 60 % Operational ist ein Startwert. Nicht als endgültig behandeln, sondern als konfigurierbar und fachlich zu prüfen kennzeichnen.
- Jeder Score liefert zusätzlich Datenqualität, Aktualität und Konfidenz.
- Unter einer Mindeststichprobe wird kein Score angezeigt, sondern "nicht genug Daten".
- Fehlende Daten werden als fehlend ausgewiesen, nicht als schlechte Qualität gewertet.
- Unterschiedliche Kategorien (Bus, Bahn, Sharing usw.) werden getrennt bewertet.
- Gewichte, Schwellen und Formeln stehen zentral in einer Konfiguration und sind dokumentiert.
- Keine Fake- oder Demo-Werte als echte Bewertungen darstellen.

## Arbeitsablauf
1. Eingangsdaten, Kategorie und Zeitraum bestimmen.
2. Mindeststichprobe und Datenqualität prüfen.
3. Teilscores mit der zentralen Konfiguration berechnen.
4. Overall Score nur berechnen, wenn beide Teilscores ausreichend belegt sind.
5. Ergebnis mit Konfidenz und Herkunft der Daten zurückgeben.
6. Unit-Tests für Grenzfälle schreiben (keine Daten, eine Stichprobe, Mindestgrenze).

## Bibliotheken und Werkzeuge
TypeScript (reine Funktionen, ohne UI-Abhängigkeit), Vitest oder Playwright für Tests.

## Sicherheitsregeln
- Bewertungen dürfen nicht durch Nutzer manipulierbar sein. Schreibzugriffe nur serverseitig.
- Personenbezogene Bewertungsdaten nur pseudonymisiert speichern.

## Typische Fehler
- Score ohne Mindeststichprobe angezeigt.
- Gewichtung fest im Code verteilt statt zentral.
- Fehlende Daten als 0 gewertet.
- Overall Score aus nur einem Teilscore berechnet, ohne das anzuzeigen.

## Qualitätskontrolle
- Grenzfälle sind getestet.
- Jede Anzeige nennt die Anzahl der Datenpunkte oder die Konfidenz.

## Definition of Done
- Berechnung ist rein, getestet und zentral konfiguriert.
- UI zeigt Konfidenz und "nicht genug Daten" korrekt an.
- Gewichtungen sind in der Dokumentation als vorläufig markiert.
