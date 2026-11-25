# MOVORA – Datenbankmodell (Entwurf)

Status: **Entwurf zur Prüfung.** Dieses Dokument beschreibt die geplanten Entitäten und Beziehungen. Es enthält keine Migrationen. Migrationen werden vom Supabase-Agenten erstellt und geprüft, nachdem dieses Modell freigegeben wurde (siehe [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)).

Zuständigkeiten:

- **Payments** und **Scoring** definieren ihre Schemaanforderungen (welche Felder und Beziehungen sie brauchen).
- **Supabase-Agent** erstellt die Migrationen, prüft sie und dokumentiert sie.

## 1. Grundprinzipien

- PostgreSQL in Supabase mit **PostGIS** für Haltestellen und Strecken.
- **Row Level Security** ist auf jeder Tabelle aktiviert, ohne Ausnahme.
- Öffentliche Mobilitätsdaten (GTFS) sind lesbar, Schreibrechte liegen ausschließlich serverseitig.
- Nutzerbewertungen sind personenbezogen. Sie werden pseudonymisiert gespeichert und nie öffentlich mit Konto-ID ausgegeben.
- Herkunft jeder Information wird gespeichert (Quelle, Abrufzeitpunkt, Lizenz), damit Datenquellen transparent bleiben.
- Fehlende Daten werden als **fehlend** gespeichert, nie als 0 oder schlechte Bewertung.

## 2. Entitäten (Entwurf)

| Entität | Zweck | Wichtige Felder |
| --- | --- | --- |
| `organizations` | Verkehrsunternehmen oder Anbieter (B2C-Anbieter und B2B-Kunden getrennt über `kind`) | id, name, kind, created_at |
| `transport_modes` | Verkehrsmittel (Bus, Bahn, Tram, Sharing, Taxi usw.) | id, code, label_de |
| `lines` | Linien eines Anbieters | id, organization_id, mode_id, short_name, long_name, source_id |
| `stops` | Haltestellen und Stationen | id, name, location (PostGIS `geography(Point, 4326)`), source_id, source_updated_at |
| `stop_lines` | Zuordnung Haltestelle zu Linie | stop_id, line_id, sequence |
| `trips` | Fahrten einer Linie zu einem Fahrplan | id, line_id, service_id, source_id |
| `trip_stops` | Abfahrts- und Ankunftszeiten je Halt | trip_id, stop_id, sequence, arrival_time, departure_time |
| `data_sources` | Herkunft der Daten (GTFS-Feed, Echtzeit, Eigenerfassung) | id, name, type, license, url, last_imported_at, validation_status |
| `profiles` | Nutzerprofil, verknüpft mit `auth.users` | id (= auth.users.id), display_name, role, created_at |
| `user_roles` | Rollen und Rechte (siehe Abschnitt 4) | user_id, role, organization_id |
| `ratings` | Bewertungen von Nutzern zu Linien oder Haltestellen | id, reviewer_key, target_type, target_id, dimension, value, created_at |
| `score_snapshots` | Berechnete Scores mit Stichprobengröße (Scoring-Agent) | target_type, target_id, community_score, operational_score, overall_score, sample_size, data_quality, computed_at |

Scoring-Felder sind im Entwurf vorgesehen. Die genaue Berechnung liegt im Scoring-Modul und wird separat freigegeben.

## 3. Beziehungen

- `organizations` 1:n `lines`
- `transport_modes` 1:n `lines`
- `lines` n:m `stops` über `stop_lines`
- `lines` 1:n `trips` 1:n `trip_stops` n:1 `stops`
- Jede fachliche Tabelle hat `source_id` → `data_sources`
- `ratings` verweist polymorph über `target_type` und `target_id` auf `lines` oder `stops`. Die Integrität prüft eine Constraint-Funktion oder eine Trigger-Prüfung.
- `score_snapshots` verweist polymorph auf Ziele und speichert `sample_size`.

## 4. Rollen und Rechte

| Rolle | Geltungsbereich | Rechte (Entwurf) |
| --- | --- | --- |
| `anonymous` | Öffentlich | Lesen öffentlicher Haltestellen, Linien und aggregierter Scores |
| `user` (B2C) | Eigenes Profil | Eigene Bewertungen anlegen und ändern, eigenes Profil lesen |
| `organization_member` (B2B) | Eigene Organisation | Eigene Linien und Betriebsdaten verwalten |
| `admin` | MOVORA-Betrieb | Datenimporte freigeben, Moderation |

Gilt für alle Rollen:

- Ein Anbieter darf **nie** Bewertungen, eigene Scores oder Rohbewertungen beeinflussen oder löschen.
- Scores werden ausschließlich serverseitig berechnet. Clients dürfen sie nicht schreiben.

## 5. Schutz vor Manipulation

- Mehrere Bewertungen desselben `reviewer_key` für dasselbe Ziel werden begrenzt (Unique-Constraint oder Zeitfenster).
- Bewertungen von Anbietern oder deren Mitarbeitern für eigene Linien werden ausgeschlossen. Dies setzt eine Prüfung über `organization_members` voraus, die noch zu entwerfen ist.
- `score_snapshots` enthalten `sample_size`. Unterschreitet sie die Mindestgröße, wird der Score als „nicht ausreichend“ markiert.

## 6. Datenschutz (DSGVO)

- Keine Klarnamen in `ratings`. Die Zuordnung läuft über `reviewer_key`, einen Hash mit Server-Geheimnis.
- Löschung des Kontos entfernt `profiles` und `user_roles`. Bewertungen werden anonymisiert, nicht gelöscht, damit Scores stabil bleiben.
- Keine Standortverläufe von Nutzern speichern.

## 7. Offene Punkte

1. Freigabe des Entwurfs durch den Nutzer.
2. Festlegung der Score-Felder zusammen mit dem Scoring-Modul.
3. Entwurf der Tabelle `organization_members`.
4. Umgang mit Echtzeitdaten (GTFS-RT): eigene Tabelle oder nur Cache. Entscheidung offen.
5. Erstellung der Migrationen nach Freigabe, inklusive RLS-Tests.
