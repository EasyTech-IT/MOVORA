# Prompt 8: Suche und Anbieterprofile (Implementierungsplan)

> **Status: Plan.** Die Umsetzung mit Datenbank beginnt erst nach Freigabe des Schemas. Bis dahin gibt es nur Demo-Daten (siehe [PROMPT_7_PLAN.md](./PROMPT_7_PLAN.md)).

## 1. Ist-Zustand (geprüft)

- Keine Supabase-Tabellen und keine Migrationen vorhanden. Das Modell ist in [DATABASE_MODEL.md](./DATABASE_MODEL.md) als Entwurf beschrieben.
- Die Suche auf der Startseite arbeitet auf `DEMO_PROVIDERS` in `lib/demo-data.ts` und ist als Client-Filter umgesetzt.
- Es gibt noch keine Anbieterprofil-Route.

Folgerung: Ohne echte Datenbasis werden keine Anbieter, Scores oder Bewertungen erfunden. Die Suche bleibt auf Demo-Daten beschränkt, bis GTFS-Import und Schema vorhanden sind.

## 2. Ziel

- Zentrale Suche nach Anbietern, Buslinien, Bahnlinien, Haltestellen, Verkehrsmitteln, Regionen und Städten.
- Filter nach Verkehrsmittel, Region, Anbieter, Overall Score, Community Score, Operational Score und Datenaktualität.
- Anbieterprofil mit allen Feldern aus dem Prompt.
- Paginierte Ergebnisse, optimierte Abfragen.

## 3. Datenbedarf (Schemaanforderungen, Scoring und Mobilität liefern die Felder)

| Anforderung | Quelle im Modell |
| --- | --- |
| Anbieter, Kategorie, Betriebsgebiet | `organizations` (Feld `region` ergänzen) |
| Verkehrsmittel | `transport_modes`, `lines.mode_id` |
| Linien, Haltestellen | `lines`, `stops`, `stop_lines` |
| Scores, Stichprobe, Datenstand | `score_snapshots` |
| Historischer Score-Verlauf | `score_snapshots` mit `computed_at` |
| Bewertungsanzahl | Aggregat über `ratings` |
| Datenquellen, letzte Aktualisierung | `data_sources` (`last_imported_at`) |
| Nutzerbewertungen (öffentlich) | `ratings` ohne Konto-ID, nur Text und Dimension |

Offene Schemafrage: Freitext-Suche über Namen (PostgreSQL `pg_trgm` oder Volltext) und Umkreissuche (PostGIS `ST_DWithin`) brauchen Indizes. Entscheidung vor der Migration.

## 4. Suchdesign

- Eine Suchfunktion mit Parametern `q`, `kind`, `mode`, `region`, `minOverall`, `freshness`, `page`, `pageSize`.
- Die Suche läuft serverseitig in einer Supabase-Funktion oder einer Server-Action, nicht im Client.
- Paginierung per Offset mit `pageSize` 20 als Standard und Obergrenze 50. Bei großen Datenmengen später Cursor-Pagination.
- Scores werden nur angezeigt, wenn `sample_size` über der Mindestgröße liegt (siehe [SCORING_ENGINE.md](./SCORING_ENGINE.md)). Sonst steht dort "Noch nicht ausreichend Daten".
- Fehlende Werte werden als "Keine Daten" gekennzeichnet, nie als 0.

## 5. Anbieterprofil

- Route `app/anbieter/[slug]/page.tsx`, öffentlich lesbar.
- Unbekannter Slug liefert `notFound()`, kein erfundenes Profil.
- Abschnitte: Stammdaten, Verkehrsmittel, drei Scores mit Stichprobe und Datenstand, Score-Verlauf, Datenquellen, Nutzerbewertungen.
- Logo nur, wenn der Anbieter die Nutzung erlaubt hat (Feld `logo_license_ok`). Sonst Platzhalter mit Initialen.

## 6. Sicherheit

- Öffentliche Lesezugriffe nur auf freigegebene Spalten (siehe [RLS_POLICY_PLAN.md](./RLS_POLICY_PLAN.md)). Keine Konto-IDs in Antworten.
- Keine Schreibrechte für Anbieter auf Bewertungen oder Scores.
- Eingaben der Suche werden validiert und begrenzt (Länge, Zeichen, Seitenzahl).

## 7. Umsetzungsschritte nach Freigabe

1. Schema-Ergänzungen (`organizations.region`, `organizations.slug`, `data_sources.last_imported_at`) als Vorschlag an den Supabase-Agenten.
2. Migration mit Indizes und RLS-Tests durch den Supabase-Agenten.
3. Suchfunktion serverseitig, Unit-Test für Filter und Paginierung.
4. Anbieterprofil-Route mit `notFound()` und Scores nur mit Stichprobe.
5. Playwright: Suche mit Filter, Pagination, unbekannter Slug, Score ohne Datengrundlage zeigt "Keine Daten".

## 8. Offene Entscheidungen

- Suchtechnik: `pg_trgm` oder Volltextsuche.
- Umkreissuche für Haltestellen ja oder nein (PostGIS).
- Testrunner für Filterlogik: Vitest (neue Abhängigkeit) oder Playwright (keine neue Abhängigkeit).

## 9. Nicht Bestandteil

- Zahlungen und Premium-Freischaltung (Prompt 9).
- B2B-Analysen (Prompt 10).
- Admin-Funktionen (Prompt 11).
