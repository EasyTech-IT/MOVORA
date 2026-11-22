# Supabase Setup

Dieses Dokument beschreibt die Einrichtung des Supabase-Testprojekts für MOVORA. Es werden in diesem Schritt noch keine Tabellen, Migrationen oder Policies angelegt.

## Stand der Integration

| Bereich | Datei | Status |
| --- | --- | --- |
| Browser-Client | [client.ts](../lib/supabase/client.ts) | vorhanden, nutzt die beiden öffentlichen Variablen |
| Server-Client | [server.ts](../lib/supabase/server.ts) | vorhanden, für Server Components und Actions |
| Session-Erneuerung und Schutz | [proxy.ts](../lib/supabase/proxy.ts) | vorhanden, fail closed |
| Serverseitige Session-Prüfung | [require-claims.ts](../lib/supabase/require-claims.ts) | vorhanden, wird in `/protected` genutzt |
| Supabase-CLI | — | nicht installiert, keine Migrationen vorhanden |
| Migrationen (`supabase/migrations/`) | — | nicht vorhanden |

Die Integration ist ein Auth-Grundgerüst aus dem Supabase-Next.js-Starter. Datenbanktabellen für MOVORA fehlen noch. Sie werden nach der Freigabe des Datenbankmodells (siehe Prompt 2) als SQL-Entwurf erstellt.

## Drei Umgebungen

Die Trennung ist in [ENVIRONMENT_CONFIGURATION.md](./ENVIRONMENT_CONFIGURATION.md) beschrieben:

- **Local Development:** Entwicklung auf dem eigenen Rechner, Werte in `.env.local`.
- **Supabase Test Project:** eigenes Projekt für E2E-Tests und den Session-Test.
- **Production:** noch nicht eingerichtet. Es wird nie für Tests verwendet.

## Schritt 1: Testprojekt anlegen

1. In der Supabase-Oberfläche ein **neues** Projekt anlegen. Name z. B. `movora-test`.
2. Region in der EU wählen (Datenschutz, DSGVO).
3. Datenbankpasswort im Passwortmanager ablegen. Es wird für dieses Setup nicht benötigt und gehört nicht in das Repository.
4. Warten, bis das Projekt bereit ist.

## Schritt 2: Werte übernehmen

Unter den API-Einstellungen des Testprojekts (Project Settings > API) stehen:

- **Project URL**
- **Publishable Key** (alternativ Anon Key)

Diese beiden Werte in `.env.local` eintragen:

```
NEXT_PUBLIC_SUPABASE_URL=<Project URL des Testprojekts>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<Publishable Key des Testprojekts>
```

Hinweise:

- Den **Service-Role-Key** nicht kopieren. Er wird im Frontend nicht benötigt.
- Passwörter und Secret Keys nicht in den Chat schreiben.
- `.env.local` nicht committen. Die Datei ist git-ignoriert.

## Schritt 3: Authentifizierung im Testprojekt prüfen

Im Dashboard des Testprojekts unter Authentication:

- E-Mail-Anmeldung aktiviert.
- Bestätigungs-E-Mail gemäß Projekteinstellung (für Tests kann die Bestätigung deaktiviert werden, das gilt nur für das Testprojekt).
- Redirect-URL für lokale Entwicklung eintragen: `http://localhost:3000/**`.

## Schritt 4: Verbindung prüfen

```powershell
npm run dev
```

Dann im Browser:

1. `http://localhost:3000` lädt.
2. `http://localhost:3000/auth/login` ist erreichbar.
3. `http://localhost:3000/protected` leitet ohne Session zur Anmeldung weiter.

Automatisiert:

```powershell
npm test
```

Die Tests `missing-env` und `invalid-env` laufen ohne Zugangsdaten. Der Test `authenticated` wird übersprungen, bis `E2E_USER_EMAIL` und `E2E_USER_PASSWORD` gesetzt sind.

## Schritt 5: Session-Test vorbereiten (optional, aber vor der ersten echten Registrierung Pflicht)

1. Im Testprojekt ein Testkonto anlegen, das nur für Tests dient.
2. Zugangsdaten in `.env.local` eintragen:
   ```
   E2E_USER_EMAIL=<Testkonto>
   E2E_USER_PASSWORD=<Passwort des Testkontos>
   ```
3. `npm test` ausführen. Der Test `authenticated` muss dann bestanden werden.

Für CI gehören diese Werte in GitHub Secrets, nie in den Code.

## Supabase-CLI (optional)

Die Supabase-CLI ist für lokale Datenbanken und Migrationsprüfungen sinnvoll. Sie ist in diesem Projekt bewusst **nicht** als Abhängigkeit installiert. Bei Bedarf wird sie zu einem späteren Zeitpunkt eingerichtet und dokumentiert. Dafür ist eine lokale Docker-Installation nötig.

## Regeln für Datenbankänderungen

- Keine Änderungen am Testprojekt ohne dokumentierten Migrationsentwurf.
- Keine Änderungen am Produktionsprojekt ohne ausdrückliche Freigabe.
- Jede neue Tabelle mit Nutzerbezug erhält RLS (Row Level Security) und Tests dafür.
- Service-Role-Keys bleiben auf serverseitige Funktionen beschränkt.

## Offene Punkte

- Testprojekt ist noch nicht angelegt oder verbunden (Eingabe durch den Nutzer nötig).
- Session-Test (`authenticated.spec.ts`) noch nicht durchgeführt.
- Datenbankmodell (Prompt 2) und RLS-Konzept (Prompt 3) fehlen.
- Supabase-CLI nicht eingerichtet.
- Produktionsprojekt noch nicht angelegt.
