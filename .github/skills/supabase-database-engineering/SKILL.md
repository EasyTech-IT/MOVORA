---
name: supabase-database-engineering
description: Supabase-Datenbank, PostgreSQL, PostGIS, Auth, Storage, Edge Functions, Migrationen, Indizes und Row Level Security für MOVORA. Verwenden bei Schemaänderungen, Datenzugriff und Auth-Logik.
---

# Supabase Database Engineering

## Wann einsetzen
- Tabellen, Spalten, Indizes, Beziehungen oder Policies ändern.
- Supabase Auth, Storage oder Edge Functions verwenden.
- Geodaten mit PostGIS speichern oder abfragen.

## Zuerst lesen
1. [lib/supabase](../../../lib/supabase) (Client- und Server-Setup, Cookie-Session).
2. [proxy.ts](../../../proxy.ts) (Session-Aktualisierung).
3. Vorhandene Migrationen (falls `supabase/migrations` angelegt ist).
4. [README.md](../../../README.md) für die Umgebungsvariablen.

## Fachliche Regeln
- Schema nur über versionierte Migrationen ändern. Keine manuellen Änderungen im Dashboard für produktive Daten.
- Jede Tabelle mit Nutzerdaten bekommt Row Level Security (RLS) und explizite Policies.
- Fremdschlüssel und Indizes auf Filter- und Join-Spalten setzen. Geodaten mit GIST-Index.
- Vorhandene Supabase-Funktionen nutzen (Auth, Storage, RPC), keine eigene Auth-Lösung.
- Produktive Datenbanken nur nach ausdrücklicher Freigabe des Nutzers verändern.

## Arbeitsablauf
1. Ist-Schema prüfen (bestehende Tabellen und Policies).
2. Migration als SQL-Datei entwerfen, mit Kommentar zum Zweck.
3. Policies für jede Rolle festlegen (anonym, authentifiziert, Anbieter, Admin).
4. Lokal anwenden und mit Testdaten prüfen. Fake-Daten klar als solche kennzeichnen.
5. Im Code die generierten Typen oder Zod-Schemas anpassen.

## Bibliotheken und Werkzeuge
`@supabase/ssr`, `@supabase/supabase-js`, Supabase CLI, PostgreSQL, PostGIS.

## Sicherheitsregeln
- Der Service-Role-Key bleibt auf dem Server und wird nie an den Browser gegeben.
- Nur der Publishable Key (`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`) ist öffentlich.
- Keine Secrets in Migrationen oder Seed-Dateien.
- Backups vor destruktiven Änderungen (DROP, Spaltenlöschung).

## Typische Fehler
- Tabelle ohne RLS angelegt, dadurch für alle lesbar.
- Policy nutzt `auth.uid()` ohne passende Spalte.
- Service-Role-Client im Client-Bundle.
- Schemaänderung direkt im Dashboard, ohne Migration.

## Qualitätskontrolle
- Jede Policy wurde für einen anonymen und einen eingeloggten Nutzer geprüft.
- Migration ist reproduzierbar und idempotent geschrieben.

## Definition of Done
- Migration vorhanden, dokumentiert und getestet.
- RLS aktiv, Policies geprüft.
- Änderung in `docs/` vermerkt (Datenbankänderungen dokumentieren).
