# Umgebungskonfiguration

Dieses Dokument legt fest, welche Umgebung welche Supabase-Projekte und Zugangsdaten verwendet. Es enthält keine Werte, nur Namen und Regeln.

## Drei getrennte Umgebungen

| Umgebung | Zweck | Supabase-Projekt | Wo liegen die Werte |
| --- | --- | --- | --- |
| Local Development | Entwicklung auf dem eigenen Rechner (`npm run dev`) | Testprojekt | `.env.local` (git-ignoriert) |
| Supabase Test Project | E2E-Tests, Session-Tests, Migrationsprüfung | Eigenes, separates Testprojekt | `.env.local` lokal, später GitHub Secrets für CI |
| Production | Öffentlicher Betrieb (noch nicht eingerichtet) | Eigenes Produktionsprojekt | Umgebungsvariablen des Hostings, niemals im Repository |

Regeln:

- Das Testprojekt und das Produktionsprojekt sind getrennte Supabase-Projekte mit eigener URL und eigenen Schlüsseln.
- E2E-Tests und Entwicklung verwenden niemals das Produktionsprojekt.
- Produktionsschlüssel werden nicht in `.env.local` eingetragen.
- Es gibt keine gemeinsame Datei für mehrere Umgebungen. Jede Umgebung setzt ihre Werte selbst.

## Variablen

| Variable | Pflicht | Öffentlich (Browser) | Beschreibung |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | ja | ja | Project URL aus den Supabase-Projekteinstellungen (API). Muss eine gültige `http`- oder `https`-URL sein. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | ja | ja | Publishable Key (bzw. Anon Key). Nur dieser Schlüssel darf im Frontend stehen. |
| `E2E_USER_EMAIL` | nein | nein | Testkonto für den Session-Test. Nur im Testprojekt anlegen. |
| `E2E_USER_PASSWORD` | nein | nein | Passwort des Testkontos. Niemals im Chat, im Code oder in Git weitergeben. |

Nicht im Repository und nicht im Frontend:

- Service-Role-Keys (`SUPABASE_SERVICE_ROLE_KEY`). Sie umgehen RLS und gehören nur in serverseitige, geprüfte Umgebungen.
- Datenbank-Passwörter und Verbindungsstrings. Für den aktuellen Stand werden sie nicht benötigt.
- Stripe-Secret-Keys und Webhook-Secrets (werden mit dem Payment-Prompt eingeführt).

## Verhalten bei fehlender oder ungültiger Konfiguration

Die Anwendung schützt geschützte Bereiche bei fehlenden oder ungültigen Variablen (fail closed):

- `hasEnvVars` in [utils.ts](../lib/utils.ts) verlangt einen nicht leeren Schlüssel und eine gültige http/https-URL.
- Die Proxy-Schicht leitet geschützte Pfade bei ungültiger Konfiguration zur Anmeldung um.
- `requireClaims()` verweigert den Zugriff auf `/protected` ohne gültige Session.
- Öffentliche Seiten bleiben ohne Konfiguration erreichbar.

Die Tests dafür stehen in `tests/e2e/missing-env.spec.ts` und `tests/e2e/invalid-env.spec.ts`.

## Lokale Einrichtung

1. `.env.example` nach `.env.local` kopieren.
2. Die Platzhalter durch die Werte des Testprojekts ersetzen.
3. `npm run dev` starten.

`.env.example` enthält absichtlich nur Platzhalter. Die Platzhalter `your-project-url` und `your-publishable-or-anon-key` sind ungültig und führen dazu, dass geschützte Bereiche gesperrt bleiben.

## Playwright

`playwright.config.ts` startet drei Server mit unterschiedlicher Konfiguration:

| Projekt | Port | Konfiguration |
| --- | --- | --- |
| `chromium` | 3000 | Werte aus `.env.local` |
| `missing-env` | 3001 | Variablen leer |
| `invalid-env` | 3002 | Ungültige URL |

Die Test-Server verwenden ein eigenes Build-Verzeichnis (`NEXT_DIST_DIR`). Das verhindert Konflikte beim gleichzeitigen Start.

## Checkliste vor dem ersten Live-Betrieb

- [ ] Produktionsprojekt ist getrennt vom Testprojekt angelegt.
- [ ] Produktionswerte sind nur in den Umgebungsvariablen des Hostings gesetzt.
- [ ] Kein Service-Role-Key im Frontend oder im Repository.
- [ ] Session-Test mit einem Testkonto im Testprojekt bestanden.
- [ ] RLS ist für alle nutzerbezogenen Tabellen aktiv (siehe [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)).
