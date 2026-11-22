# MOVORA – B2B-Analyse-Dashboard (Konzept)

> **Status: Konzept.** Es wird nichts implementiert, solange die Datenbasis fehlt. Abhängig von Schema (Prompt 8), Scoring ([SCORING_ENGINE.md](./SCORING_ENGINE.md)), Abos ([SUBSCRIPTION_MODEL.md](./SUBSCRIPTION_MODEL.md)) und Rollen (Prompt 11).

## 1. Zielgruppen

- Verkehrsunternehmen und Mobilitätsanbieter (eigene Daten)
- Betreiber und Organisationen (Teammitglieder mit Rollen)
- Mobilitätsanalysten (Vergleich, Export)

## 2. Seitenstruktur

Alle Seiten liegen unter `/unternehmen` und sind serverseitig geschützt (Session plus Organisationsmitgliedschaft).

| Route | Inhalt | Plan |
| --- | --- | --- |
| `/unternehmen` | Übersicht: Overall, Community und Operational Score, Score-Verlauf, Datenabdeckung | Business Starter |
| `/unternehmen/linien` | Linienanalysen mit Sortierung und Filter | Starter |
| `/unternehmen/regionen` | Regionenvergleich | Professional |
| `/unternehmen/puenktlichkeit` | Pünktlichkeit und Ausfälle aus GTFS-RT | Professional |
| `/unternehmen/feedback` | Nutzerfeedback (aggregiert, ohne Konto-IDs) | Starter |
| `/unternehmen/berichte` | Zeitraumfilter, Vergleichsansicht, PDF- und CSV-Export | Starter (CSV), Professional (PDF) |
| `/unternehmen/team` | Mitglieder, Rollen, Einladungen | Professional |
| `/unternehmen/datenquellen` | Quellen, Aktualität, Validierungsstatus | Starter |

## 3. Datenflüsse

- **Lesen:** Server Components lesen über eine Supabase-Funktion oder Server Action. Der Browser erhält nur fertige, aggregierte Werte.
- **Scores:** kommen ausschließlich aus `score_snapshots`. Die Berechnung läuft serverseitig und nie im Dashboard.
- **Pünktlichkeit und Ausfälle:** aus GTFS-RT-Verarbeitung (siehe [MOBILITY_DATA_PLAN.md](./MOBILITY_DATA_PLAN.md)). Ohne Echtzeitdaten wird die Kachel als "Keine Echtzeitdaten" angezeigt.
- **Nutzerfeedback:** nur aggregiert. Einzelbewertungen werden ohne Konto-ID angezeigt, und nur wenn die Mindestanzahl erreicht ist.
- **Exporte:** PDF und CSV werden serverseitig erzeugt. Die Datei enthält Datenstand und Stichprobengröße. Kein Export ohne aktives Entitlement.

## 4. Berechtigungen

| Aktion | Owner | Admin des Unternehmens | Mitglied | Analyst (extern) |
| --- | --- | --- | --- | --- |
| Dashboard lesen | ja | ja | ja | ja (nur freigegebene Organisationen) |
| Berichte exportieren | ja | ja | ja | nein |
| Team verwalten | ja | ja | nein | nein |
| Community-Bewertung löschen | nein | nein | nein | nein |
| Score ändern | nein | nein | nein | nein |
| Negative Bewertung unterdrücken | nein | nein | nein | nein |

Die letzten drei Zeilen gelten für alle Rollen ohne Ausnahme. Sie sind keine Konfigurationsoption.

## 5. Teamverwaltung

- Einladung per E-Mail mit einmaligem Token, Ablauf nach 7 Tagen.
- Rollen: `owner`, `admin`, `member`, `analyst`.
- Mindestens ein `owner` muss bestehen bleiben.
- Jede Änderung von Rollen wird im Audit Log protokolliert (siehe Prompt 11).

## 6. Konkrete Regeln aus dem Prompt

- Eigene Daten und Analysen sichtbar: ja, nur für Mitglieder der eigenen Organisation.
- Export: ja, im passenden Plan und mit Datenstand.
- Eigene Mitglieder verwalten: ja, ab Rolle `admin` und Plan Professional.
- Community-Bewertungen löschen, Scores manipulieren, negative Bewertungen unterdrücken, Scores durch Zahlung verbessern: **nicht möglich**. Es gibt dafür keine Funktion und keine Schreibrechte.

## 7. Datenbasis je Kachel

| Kachel | Datenbasis | Status heute |
| --- | --- | --- |
| Gesamtbewertung, Community, Operational | `score_snapshots` | fehlt (Scoring nicht implementiert) |
| Score-Entwicklung | `score_snapshots` mit Verlauf | fehlt |
| Datenabdeckung | `data_sources`, `trips` | fehlt |
| Linienanalysen | `lines`, `ratings` | fehlt |
| Pünktlichkeit, Ausfälle | GTFS-RT (noch nicht angebunden) | fehlt |
| Nutzerfeedback | `ratings` aggregiert | fehlt |

Solange eine Datenbasis fehlt, zeigt die Oberfläche einen Hinweis statt einer Zahl. Es werden keine Kacheln mit erfundenen Werten gebaut.

## 8. Umsetzungsreihenfolge (nach Freigabe)

1. Schema und Rollen (Prompt 8, Prompt 11).
2. Team und Rechte mit Tests (RLS und Server-Prüfung).
3. Übersicht und Datenabdeckung.
4. Linien und Feedback.
5. Export (CSV, dann PDF).
6. Pünktlichkeit, sobald GTFS-RT angebunden ist.

## 9. Offene Punkte

- PDF-Erzeugung: serverseitige Bibliothek (neue Abhängigkeit, Freigabe nötig) oder Browser-Druck.
- Mindestanzahl für Nutzerfeedback festlegen.
- Analyst-Zugriff: ob Mobilitätsanalysten extern eingeladen werden dürfen.
