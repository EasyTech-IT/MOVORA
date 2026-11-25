---
name: security-and-privacy
description: DSGVO, Authentifizierung, Autorisierung, RLS, API-Sicherheit, Secrets, Rate Limiting und Webhook-Sicherheit für MOVORA. Verwenden bei jeder kritischen Änderung an Auth, Daten, Zahlungen oder Schnittstellen.
---

# Sicherheit und Datenschutz

## Wann einsetzen
- Änderungen an Login, Registrierung, Rollen, Policies oder Sessions.
- Neue API-Route, Webhook oder externe Verbindung.
- Verarbeitung personenbezogener Daten.
- Vor jedem Release.

## Zuerst lesen
1. [proxy.ts](../../../proxy.ts) und [lib/supabase](../../../lib/supabase) (Session-Handling).
2. [.env.example](../../../.env.example) (welche Secrets existieren).
3. [.gitignore](../../../.gitignore) (`.env*.local` muss ignoriert sein).

## Fachliche Regeln
- Autorisierung immer serverseitig. Die Oberfläche ist nie eine Sicherheitsgrenze.
- Row Level Security auf allen Tabellen mit Nutzerdaten.
- Eingaben mit einem Schema validieren (z. B. Zod), bevor sie gespeichert werden.
- Secrets nur über Umgebungsvariablen. Nie im Code, nie in Commits.
- Nur Daten erheben, die nötig sind (Datenminimierung, DSGVO).
- Audit-Log für sicherheitsrelevante Aktionen (Rollenänderung, Zahlung, Export).
- Rate Limiting für Login, Registrierung und öffentliche API.

## Arbeitsablauf
1. Betroffene Angriffsfläche benennen.
2. Auth- und RLS-Prüfung für jede Rolle.
3. Eingaben validieren, Fehler ohne interne Details zurückgeben.
4. Secrets-Scan vor dem Commit (keine Schlüssel im Diff).
5. Ergebnis im Sicherheitsabschnitt der Änderungsdokumentation festhalten.

## Bibliotheken und Werkzeuge
Supabase Auth und RLS, Zod (Eingabevalidierung, sofern eingeführt), GitHub Secret Scanning.

## Sicherheitsregeln
- Keine Schlüssel in `NEXT_PUBLIC_`-Variablen außer dem Publishable Key.
- Webhooks mit Signatur prüfen.
- Keine Rückgabe von Stacktraces oder Datenbankfehlern an den Client.

## Typische Fehler
- Nur UI-Prüfung, keine Serverprüfung.
- Service-Role-Key in Client-Code.
- Fehlende RLS nach neuer Tabelle.
- `.env.local` versehentlich committet.

## Qualitätskontrolle
- Jede neue Route hat eine Auth-Prüfung oder ist bewusst öffentlich.
- Keine Secrets im Diff.

## Definition of Done
- Auth, RLS und Validierung für die Änderung geprüft.
- Keine Secrets im Repository.
- Sicherheitsrelevante Entscheidungen dokumentiert.
