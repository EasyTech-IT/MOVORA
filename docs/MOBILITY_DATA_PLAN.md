# MOVORA – Mobilitätsdaten (Konzept)

Status: **Entwurf.** Dieses Dokument legt Quellen, Validierung und Importablauf fest. Der Import selbst ist noch nicht gebaut. Er folgt erst nach Freigabe des [Datenbankmodells](./DATABASE_MODEL.md) und der [RLS-Policies](./RLS_POLICY_PLAN.md).

Die fachlichen Regeln stehen im Skill [mobility-data-engineering](../.github/skills/mobility-data-engineering/SKILL.md). Die verwendeten Open-Source-Komponenten sind in [OPEN_SOURCE_COMPONENTS.md](./OPEN_SOURCE_COMPONENTS.md) beschrieben.

## 1. Validierung je Format

| Format | Validator | Hinweis |
| --- | --- | --- |
| GTFS Schedule | MobilityData GTFS Validator (Apache-2.0) | Einziger Weg zur Prüfung von Fahrplänen. Kein eigener Parser. |
| GTFS-Realtime | MobilityData GTFS-Realtime Validator | Prüft Protobuf-Feeds gegen die Spezifikation. |
| GBFS | MobilityData GBFS Validator | Für Sharing-Angebote (Fahrräder, Roller, Autos). |
| Geodaten (GeoJSON) | GeoJSON-Schema | Strukturprüfung vor dem Import. |
| Geodaten in der Datenbank | PostGIS-Constraints | Gültige Geometrien, SRID 4326, Mindestabstände. |

Vor dem Einsatz jedes Validators werden Version und Lizenz geprüft. Der Validator-Bericht wird zusammen mit dem Import gespeichert.

## 2. Datenquellen

| Quelle | Format | Lizenz | Stand | Status |
| --- | --- | --- | --- | --- |
| Mobilithek / DELFI | GTFS Schedule | noch zu prüfen | – | offen |
| Regionale Verkehrsverbünde | GTFS Schedule, GTFS-RT | je Quelle | – | offen |
| MobilityDatabase (Katalog) | Verzeichnis | nur Katalog | – | nur Recherche |
| Sharing-Anbieter | GBFS | je Anbieter | – | offen |

Jede Quelle wird in der Tabelle `data_sources` des Datenmodells erfasst. Erst nach Klärung der Lizenz wird sie importiert. Quellen mit unklarer Lizenz werden nicht übernommen.

## 3. Importablauf (Entwurf)

1. **Quelle festlegen:** URL aus einer geprüften Konfiguration, keine Eingabe durch Nutzer.
2. **Herunterladen:** Rohdatei unverändert speichern, mit Zeitstempel und Prüfsumme.
3. **Validieren:** Passenden Validator ausführen, Bericht speichern. Bei kritischen Fehlern wird nicht importiert.
4. **Transformieren:** Jeder Schritt ist nachvollziehbar und wiederholbar. Zeiten über 24:00 (GTFS) werden korrekt als Betriebstag behandelt.
5. **Laden:** Upsert über stabile Quell-IDs (`source_id`), damit keine doppelten Haltestellen entstehen.
6. **Prüfen:** Stichprobe mit Anzahl Haltestellen, Linien und Zeitbereich. Ergebnis in `data_sources.validation_status` festhalten.

Der Import läuft serverseitig mit einem Zeitlimit und einer Fehlerbehandlung. Er nutzt den `service_role`-Schlüssel nur in der serverseitigen Umgebung, nie im Browser.

## 4. Echtzeitdaten (GTFS-RT)

- Jede Meldung trägt einen Zeitstempel und eine Veraltungsgrenze (Entwurf: 2 Minuten für Positionen, vorläufig).
- Veraltete Meldungen werden als veraltet angezeigt, nicht als Verspätung.
- Speicherung als Ereignisse mit kurzer Aufbewahrungsfrist. Die Entscheidung über eine eigene Tabelle oder nur einen Cache ist offen (siehe Datenmodell).
- Daten für den Operational Score stammen aus diesen Ereignissen (siehe [SCORING_ENGINE.md](./SCORING_ENGINE.md)).

## 5. Geodaten und Karte

- Haltestellen und Strecken als PostGIS-Geometrien speichern.
- Darstellung mit MapLibre über `components/map.tsx`.
- Karten zeigen die Datenquelle und den Stand an.

## 6. Sicherheit und Datenschutz

- Quell-URLs nur aus einer festen Konfiguration. Keine Nutzereingaben als URL verwenden.
- API-Schlüssel für Quellen nur als Umgebungsvariable, nie im Repository.
- Keine personenbezogenen Daten aus Quellen übernehmen, außer die Lizenz und die DSGVO erlauben es ausdrücklich.

## 7. Offene Punkte

1. Lizenzprüfung für Mobilithek, DELFI und regionale Verbünde.
2. Auswahl der ersten Testquelle (am besten ein kleiner GTFS-Feed) im Testprojekt.
3. Entscheidung über die Speicherung von GTFS-RT.
4. Freigabe der Validator-Versionen.
5. Umsetzung des Imports als versionierte Migration oder Edge Function, nach Freigabe.
