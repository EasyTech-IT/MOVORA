# MOVORA – KI-Einrichtungsbericht (MASTERPROMPT 4.0)

Stand: 2026-11-22. Branch `feature/ai-skills`. Es wurde nichts gelöscht, nichts umbenannt und keine Datei ersetzt. Vorhandene Rollen bleiben bestehen.

## 1. Geprüfte Dateien

- `.github/skills/` (12 Skills, vor der Erweiterung)
- `.github/agents/` (4 Agenten)
- `.github/prompts/` (3 Prompts)
- `.github/copilot-instructions.md`
- `AGENTS.md`
- `docs/AI_SKILLS.md`
- `docs/PROJECT_AUDIT.md`

## 2. Erweiterte Dateien

| Datei | Ergänzt |
|---|---|
| `.github/agents/movora-architect.agent.md` | Aufgaben, Nicht-Aufgaben, Zusammenarbeit, Dateibereiche, Sicherheit, Tests, Rückfragen |
| `.github/agents/movora-frontend.agent.md` | dito, `components/ui/` nicht manuell bearbeiten |
| `.github/agents/movora-supabase.agent.md` | dito, Migrationsregeln (prüfen, dokumentieren, Rollback, Dev vor Prod) |
| `.github/agents/movora-qa-security.agent.md` | dito, Code Review und Prüfung auf Score-Manipulation (read-only) |
| `.github/copilot-instructions.md` | Abschnitt „Rollen“ mit Verweis |
| `docs/AI_SKILLS.md` | Tabellen für Agenten und Prompts, neue Skills |
| `docs/PROJECT_AUDIT.md` | Namensentscheidung, Ergebnis MASTERPROMPT 4.0 |
| `docs/OPEN_SOURCE_COMPONENTS.md` | Capacitor-Verweis auf Agent und Skill |

## 3. Neue Dateien

| Datei | Zweck |
|---|---|
| `.github/agents/movora-backend.agent.md` | Route Handler, Server Actions, Imports, API |
| `.github/agents/movora-payments.agent.md` | Stripe, Webhook-Signatur, Idempotenz, Entitlements |
| `.github/agents/movora-scoring.agent.md` | Bewertungslogik, Mindeststichproben, fehlende Daten nicht als schlecht werten |
| `.github/agents/movora-tester.agent.md` | Testausführung und Test-Automatisierung |
| `.github/agents/movora-mobile.agent.md` | Android mit Capacitor |
| `.github/skills/performance-and-scaling/SKILL.md` | Messung, PostGIS-Indizes, Kartenlast, Caching |
| `.github/skills/android-mobile-capacitor/SKILL.md` | Capacitor-Regeln, Berechtigungen, Signing-Secrets |
| `.github/prompts/implement-feature.prompt.md` | Freigegebenen Plan über die Agenten umsetzen |
| `.github/prompts/run-tests.prompt.md` | Lint, Typen, Build und Tests ausführen |
| `docs/AI_SETUP_REPORT.md` | dieser Bericht |

Feature-Umsetzung hat keinen eigenen Agenten. Sie läuft über den Prompt `implement-feature`, der die Fachagenten nacheinander einsetzt. Ein zusätzlicher Agent hätte dieselbe Aufgabe doppelt abgedeckt.

## 4. Abdeckung der geforderten Funktionen

| Funktion | Abdeckung |
|---|---|
| Backend Engineering | `movora-backend` |
| Feature Implementation | Prompt `implement-feature` |
| Test Execution und Automation | `movora-tester`, Prompt `run-tests` |
| Code Review | `movora-qa-security` |
| Database Migration | `movora-supabase` und Skill `supabase-database-engineering` |
| Stripe und Payments | `movora-payments` und Skill `stripe-and-subscriptions` |
| Scoring Engine | `movora-scoring` und Skill `movora-scoring-engine` |
| API Engineering | `movora-backend` |
| Performance und Skalierung | Skill `performance-and-scaling` |
| Android und Mobile | `movora-mobile` und Skill `android-mobile-capacitor` |

## 5. Prüfergebnisse

| Prüfung | Ergebnis |
|---|---|
| Interne Markdown-Links (34 Dateien) | fehlerfrei nach Anlage dieses Berichts |
| Agenten-`name` entspricht Dateiname | 9 von 9 |
| Skill-`name` entspricht Verzeichnisname | 14 von 14 |
| `npx tsc --noEmit` | bestanden |
| `npm run lint` | bestanden |
| `npm run build` | bestanden |
| Playwright-Tests (`npm test`) | 11 bestanden, 1 übersprungen (Session-Test ohne `E2E_USER_EMAIL`/`E2E_USER_PASSWORD`) |
| Erkennung der Rollen durch Copilot | nicht geprüft. Es ist eine Sichtprüfung im VS-Code-Chat nötig. |

## 5a. Playwright-Einrichtung

- Dev-Abhängigkeit: `@playwright/test` (Installation: `npm install -D @playwright/test`, danach `npx playwright install chromium`).
- Konfiguration: [playwright.config.ts](../playwright.config.ts). Tests liegen in `tests/e2e/`.
- Drei Dev-Server, jeweils mit eigenem `distDir`, damit sie sich nicht um das `.next/dev`-Lock streiten:
  - Port 3000: normale `.env.local`-Konfiguration. Projekt `chromium`.
  - Port 3001: leere Supabase-Variablen (`.next-noenv`). Projekt `missing-env`.
  - Port 3002: ungültige URL `not-a-valid-url` (`.next-invalid`). Projekt `invalid-env`.
- Start: `npm test`. Die Konfiguration startet die Server automatisch, außer `PLAYWRIGHT_BASE_URL` ist gesetzt. Dann wird nur gegen diese URL getestet, ohne die Server mit leerer oder ungültiger Konfiguration.
- Testdateien:
  - `public-pages.spec.ts`: Startseite, Navigation, Login- und Registrierungsseite.
  - `protected-routes.spec.ts`: `/protected` ohne Session leitet auf den Login um.
  - `missing-env.spec.ts`: fehlende Konfiguration. Geschützte Seite wird verweigert, Startseite und Login bleiben erreichbar.
  - `invalid-env.spec.ts`: ungültige Konfiguration. Kein Absturz (Status unter 500), Weiterleitung auf den Login, Konfigurationshinweis auf der Startseite.
  - `authenticated.spec.ts`: gültige Session. Läuft nur mit `E2E_USER_EMAIL` und `E2E_USER_PASSWORD` gegen eine Supabase-Testumgebung. Sonst übersprungen.
- Ausgaben (`test-results/`, `playwright-report/`, `.next-noenv/`, `.next-invalid/`) sind in `.gitignore` eingetragen.

## 5b. Serverseitiger Auth-Schutz

- Der Proxy ([proxy.ts](../proxy.ts), [lib/supabase/proxy.ts](../lib/supabase/proxy.ts)) ist die erste Schicht. Er leitet nicht-öffentliche Pfade auf `/auth/login` um, wenn keine gültige Session besteht.
- Fail closed: Fehlende oder ungültige Konfiguration (`hasEnvVars` in [lib/utils.ts](../lib/utils.ts)), Fehler beim Anlegen des Clients und Fehler bei `getClaims()` führen für geschützte Pfade zum Login.
- Die Seite selbst prüft zusätzlich: [require-claims.ts](../lib/supabase/require-claims.ts) wird von [app/protected/page.tsx](../app/protected/page.tsx) vor dem Rendern aufgerufen. Der Schutz hängt damit nicht allein vom Proxy ab.
- Öffentlich bleiben: `/`, `/auth/*` und `/login*`.

## 5c. Roadmap-Dokumente (Prompts 1 bis 6)

- Konzepte ohne Migrationen und ohne Supabase-Änderungen: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md), [ENVIRONMENT_CONFIGURATION.md](./ENVIRONMENT_CONFIGURATION.md), [DATABASE_MODEL.md](./DATABASE_MODEL.md), [RLS_POLICY_PLAN.md](./RLS_POLICY_PLAN.md), [SCORING_ENGINE.md](./SCORING_ENGINE.md), [MOBILITY_DATA_PLAN.md](./MOBILITY_DATA_PLAN.md).
- Designtokens Navy, Teal und Weiß in `app/globals.css` (Commit `a2e6268`). Textkontraste mindestens 5,5:1.
- Review-Threads von PR #1 (Migrationszuständigkeit, GTFS-Validatoren) sind im Code korrigiert. Auf GitHub noch nicht als erledigt markiert.

## 6. Offene Punkte

- Der Session-Test (`authenticated.spec.ts`) ist übersprungen. Er braucht ein Testkonto in einer separaten Supabase-Testumgebung und die Variablen `E2E_USER_EMAIL` und `E2E_USER_PASSWORD`. Es wurden keine Zugangsdaten hinterlegt.
- Echter Login und echte Registrierung mit einem Supabase-Projekt sind nicht getestet.
- Kein CI-Workflow (`.github/workflows/`). Die Tests laufen nur lokal über `npm test`.
- Die Rollenerkennung in VS Code ist nicht geprüft.
- GBFS-Validator: Repository und Lizenz sind noch nicht verifiziert.
- Git-E-Mail `1-1@notify.easytechit.de` ist nicht bestätigt.
- Der Feature-Branch ist nicht nach `main` gemergt.
- Starter-Reste (`components/tutorial/*`, `VERCEL_*`-Abfragen) sind noch vorhanden.
- Die PR-Beschreibung von PR #1 ist veraltet und muss manuell aktualisiert werden.
- Scoring-Engine: Test-Runner (Vitest oder Playwright) ist nicht entschieden.

## 7. Nächste Schritte

1. Rollenerkennung im VS-Code-Chat prüfen (`/agents`, Prompts über `/`).
2. Supabase-Testprojekt anlegen, `E2E_USER_*` setzen und den Session-Test ausführen.
3. CI-Workflow mit `npm run lint`, `npm run build` und `npm test` einrichten.
4. Nach dem Merge den Feature-Branch aufräumen und Starter-Reste entfernen.

