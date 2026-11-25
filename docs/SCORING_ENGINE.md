# MOVORA – Scoring Engine (Konzept)

Status: **Entwurf.** Alle Gewichte, Schwellen und Formeln sind vorläufig und müssen fachlich geprüft werden. Sie stehen später zentral in einer Konfigurationsdatei und nicht verteilt im Code. Die Umsetzung als reine TypeScript-Funktionen erfolgt erst nach Entscheidung zum Test-Runner (siehe Abschnitt 7).

Die fachlichen Regeln stehen im Skill [movora-scoring-engine](../.github/skills/movora-scoring-engine/SKILL.md). Die Speicherung der Ergebnisse ist in [DATABASE_MODEL.md](./DATABASE_MODEL.md) als `score_snapshots` beschrieben.

## 1. Begriffe

| Begriff | Bedeutung |
| --- | --- |
| Community Score | Aggregierte Nutzerbewertungen (Zufriedenheit) |
| Operational Score | Betriebsqualität aus Mobilitätsdaten (z. B. Pünktlichkeit, Datenverfügbarkeit) |
| MOVORA Overall Score | Gewichtete Kombination beider Teilscores |
| Datenqualität | Vollständigkeit und Plausibilität der Eingangsdaten |
| Aktualität | Alter der jüngsten Eingangsdaten |
| Konfidenz | Maß dafür, wie belastbar ein Score ist (Stichprobe, Aktualität, Qualität) |

## 2. Grundregeln

- Jede Kategorie (Bus, Bahn, Tram, Sharing, Taxi usw.) wird getrennt bewertet.
- **Fehlende Daten** sind „fehlend“ und werden nicht als 0 oder als schlechte Qualität gewertet.
- Unter der Mindeststichprobe wird kein Score angezeigt, sondern „nicht genug Daten“.
- Der Overall Score wird nur berechnet, wenn **beide** Teilscores ausreichend belegt sind.
- Jedes Ergebnis enthält Stichprobengröße, Datenqualität, Aktualität, Konfidenz und Quellen.
- Berechnung erfolgt serverseitig und ist eine reine Funktion (Eingabe → Ergebnis, ohne Seiteneffekte).

## 3. Vorläufige Parameter

| Parameter | Startwert | Status |
| --- | --- | --- |
| Gewicht Community / Operational | 40 % / 60 % | vorläufig, fachlich zu prüfen |
| Mindeststichprobe Community (Bewertungen) | 10 | vorläufig |
| Mindestdatenabdeckung Operational | 70 % der erwarteten Fahrten | vorläufig |
| Aktualitätsgrenze Eingangsdaten | 48 Stunden | vorläufig |
| Bayes-Prior für Community (Pseudo-Stichprobe) | 5 Bewertungen mit Neutralwert | vorläufig |

## 4. Teilscores (Entwurf)

**Community Score:**
- Eingabe: Bewertungen (1 bis 5) je Ziel und Kategorie.
- Mittelwert mit Bayes-Glättung gegen den Neutralwert, damit wenige Bewertungen keine Extremwerte erzeugen.
- Umrechnung auf 0 bis 100.
- Keine Ausgabe unter der Mindeststichprobe.

**Operational Score:**
- Eingabe: Pünktlichkeit aus GTFS-Realtime, Abdeckung der Echtzeitdaten, Fahrplanqualität aus GTFS-Validierung.
- Jede Komponente wird separat ausgewiesen.
- Fehlt eine Komponente, wird der Score nicht mit 0 aufgefüllt. Stattdessen wird die Konfidenz gesenkt und die fehlende Komponente angezeigt.

## 5. Konfidenz und Overall

- Konfidenz (0 bis 1) aus Stichprobengröße, Aktualität und Datenabdeckung. Die genaue Formel ist offen.
- Overall = 0,4 × Community + 0,6 × Operational, nur wenn beide Teilscores vorhanden sind.
- Ist ein Teilscore nicht verfügbar, wird kein Overall Score ausgegeben. Es gibt keinen Ersatzwert aus nur einem Teil.

## 6. Manipulationsschutz

- Die Berechnung liest nur serverseitig bereinigte Bewertungen. Anbieter haben keinen Einfluss auf Bewertungen eigener Linien (siehe [RLS_POLICY_PLAN.md](./RLS_POLICY_PLAN.md)).
- Ausreißer und Mehrfachbewertungen desselben Nutzers werden vor der Aggregation gefiltert.
- Scores werden nur mit Berechnungszeitpunkt und Versionsnummer der Konfiguration gespeichert, damit Änderungen nachvollziehbar bleiben.

## 7. Umsetzung und offene Entscheidung

- Code: `lib/scoring/` mit Konfiguration, reinen Funktionen und Tests für Grenzfälle (keine Daten, eine Bewertung, Mindestgrenze, fehlende Operational-Komponente).
- **Offene Entscheidung:** Der Skill nennt Vitest oder Playwright. Vitest wäre eine neue Dev-Abhängigkeit. Vor der Umsetzung braucht es deine Freigabe.

## 8. Offene Punkte

1. Fachliche Prüfung aller vorläufigen Parameter.
2. Formel für die Konfidenz.
3. Festlegung der Operational-Komponenten (welche GTFS-RT-Metriken).
4. Test-Runner-Entscheidung (Vitest oder Playwright-Unit-Tests).
