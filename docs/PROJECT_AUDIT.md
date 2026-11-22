# MOVORA – Projekt-Audit (Phase 1)

Stand: 2026-11-22. Geprüft wurden das Repository `EasyTech-IT/MOVORA`, Branch `feature/ai-skills` und die lokale Windows-11-Umgebung.

## Repository

- Git: `main` (Commits `b225c17`, `040d510`). Branch `feature/ai-skills` mit den Commits, auf `origin` gepusht und per PR #1 gegen `main` offen:
  - `4bf042b` KI-Skills, Agenten, Prompts und Copilot-Anweisungen
  - `b17f2cf` fehlende KI-Rollen ergänzt
  - `b1b87dd` Playwright als E2E-Framework
  - `8487671` Proxy fail-closed bei fehlenden Supabase-Variablen, PR-Review-Report
  - `8487671` Proxy fail-closed bei fehlenden Supabase-Variablen, PR-Review-Report
  - `2a89cfd` serverseitiger Auth-Schutz (`requireClaims()`), erweiterte Playwright-Tests
  - `ede68bb` Härtung bei ungültiger Supabase-Konfiguration, Playwright-Tests `invalid-env`
  - `935fb90` Prompt 7: Startseite und Navigation (Demo-Daten)
  - `178a92c` Prompt 7 als umgesetzt markiert
  - `24048f3` Prompt 9: Zahlungs- und Abo-Konzept (ohne Zahlungen)
  - `1719db9` Prompts 10 bis 12: Konzepte (B2B, Admin, Android)
  - `5524d4e` Prompt 8: Suche und Anbieterprofile (Demo-Daten)
- Der Branch ist noch nicht nach `main` gemergt.
- Basis: Supabase Next.js Starter (`with-supabase`), Next.js 16.4.6, React 19, Tailwind 3.4, `@supabase/ssr`.
- Skripte in `package.json`: `dev`, `build`, `start`, `lint`, `test` (Playwright).
- Verwendete Supabase-Variablen: `NEXT_PUBLIC_SUPABASE_URL` und `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (`lib/supabase/client.ts`, `lib/supabase/server.ts`, `lib/supabase/proxy.ts`). `.env.example` enthält nur Platzhalter. `.env.local` ist vorhanden und git-ignoriert.
- Keine Datenbanktabellen oder Migrationen im Repository. Der einzige Datenzugriff ist ein Beispiel (`components/tutorial/fetch-data-steps.tsx`, Tabelle `notes`).

## Geprüfte Bausteine

| Bereich | Stand |
|---|---|
| Login, Registrierung, Passwort-Reset | Vorhanden (`components/login-form.tsx`, `sign-up-form.tsx`, `forgot-password-form.tsx`, `update-password-form.tsx`). Nicht mit echten Zugangsdaten getestet. |
| Session-Schutz | Zweistufig: Proxy (`lib/supabase/proxy.ts`, fail closed bei fehlender oder ungültiger Konfiguration) und `requireClaims()` in `app/protected/page.tsx`. Weiterleitung auf Login per Playwright geprüft. |
| UI | shadcn/ui-Komponenten in `components/ui/`. Designsystem Navy/Teal noch nicht angewendet (`app/globals.css`). |
| Karten | `components/map.tsx` (MapLibre-Wrapper), noch nicht auf einer Seite eingebunden. |
| Starter-Reste | `components/tutorial/*` und `VERCEL_*`-Abfragen in `app/layout.tsx` und `sign-up-user-steps.tsx`. Für MOVORA nicht nötig, sollten entfernt werden. |
| KI-Konfiguration | `.github/copilot-instructions.md`, `AGENTS.md`, 14 Skills in `.github/skills/`, 9 Agenten und 5 Prompts. Stand siehe [AI_SETUP_REPORT.md](./AI_SETUP_REPORT.md). |
| Dokumentation | `README.md`, `docs/OPEN_SOURCE_COMPONENTS.md`, `docs/AI_SKILLS.md`, dieses Audit. |

## Lokale Entwicklungsumgebung

| Werkzeug | Status |
|---|---|
| Windows 11 | Vorhanden |
| Node.js | v24.22.1, vorhanden |
| npm | 11.19.1, vorhanden. PowerShell blockiert `npm.ps1`, deshalb `npm.cmd` verwenden. |
| Git | 2.55.0, vorhanden |
| GitHub CLI (`gh`) | Fehlt |
| Visual Studio Code | Vorhanden (`code.cmd`) |
| Python | 3.14.7, vorhanden |
| Docker Desktop | Client 29.8.0, vorhanden. Daemon-Status nicht geprüft. |
| PostgreSQL-Client (`psql`) | Fehlt, für den Betrieb über Supabase nicht zwingend |
| Supabase CLI | Fehlt. Für Migrationen sinnvoll (Phase 5/6). |
| pnpm | Fehlt, nicht nötig, da das Projekt npm nutzt |

## Ergebnis nach Kategorien

**A. Vorhanden und funktionsfähig**
- Git-Repository mit Historie, Feature-Branch auf GitHub.
- `npm run lint` und `npm run build` laufen fehlerfrei (geprüft im vorherigen Schritt).
- Dev-Server antwortet auf `/`, `/auth/login`, `/auth/sign-up`. `/protected` leitet ohne Session auf Login weiter.
- Playwright: 16 Tests bestanden, 1 übersprungen (Session-Test ohne Testkonto). Abdeckung: öffentliche Seiten, Suche und Anbieterprofile, Schutz geschützter Seiten, fehlende und ungültige Supabase-Variablen.
- `npx tsc --noEmit`, `npm run lint` und `npm run build` bestanden.
- Node.js, npm, Git, VS Code und Python sind installiert.

**B. Vorhanden, aber nicht vollständig eingerichtet**
- Registrierung und Login mit echten Supabase-Zugangsdaten: nicht getestet. Email-Bestätigung in Supabase: unbekannt.
- `.vscode/`, `.editorconfig`, `.prettierrc` fehlen. ESLint ist vorhanden (`eslint.config.mjs`), Prettier nicht.
- Skills und Agenten entsprechen nicht genau den Namen aus dem neuen Masterprompt (siehe offene Punkte).
- `docs/`-Dateien aus Kapitel 18 fehlen: ARCHITECTURE, DATABASE, DATA_SOURCES, SCORING, MCP_SETUP, SECURITY, DEPLOYMENT, ROADMAP.
- `README.md` muss um Tests, Entwicklungsablauf und Umgebungsvariablen erweitert werden.
- Starter-Reste (Tutorial-Komponenten, Vercel-Abfragen) sind noch vorhanden.

**C. Fehlt und muss eingerichtet werden**
- GitHub CLI (`gh`), Supabase CLI.
- `.github/workflows/` (CI-Pipeline).
- Projekt-Dokumente aus Kapitel 18 (siehe B).
- MCP-Server (Supabase, GitHub, Playwright, Context7). Konfiguration noch nicht geprüft.
- Datenbankschema mit RLS. Noch keine Tabellen.
- Externe Dienste: Stripe, Google Play Console, AdMob, Google Analytics und Google Ads, Mobilitätsdatenquellen. Sie kommen in Phase 4 und erfordern deine Anmeldung.
- Designsystem (Navy, Teal, Weiß) in `app/globals.css`.

## Risiken

- **Keine RLS-Policies:** Es gibt noch keine eigenen Tabellen. Jede neue Tabelle braucht RLS vor der Nutzung.
- **Starter-Abhängigkeiten:** `@supabase/ssr` und `@supabase/supabase-js` sind auf `latest` gepinnt. Vor dem Produktivbetrieb feste Versionen setzen.
- **Ungetestete Auth:** Der Login-Ablauf ist nicht End-to-End geprüft. Das ist das größte offene Risiko.
- **Namensabweichung zum Masterprompt:** Die vorhandenen Namen (z. B. `movora-scoring-engine`, `supabase-database-engineering`) bleiben bestehen. Entscheidung: nur fehlende Rollen ergänzen, keine Umbenennung, keine Doppelung.

## Offene Punkte

1. Feature-Branch `feature/ai-skills` nach `main` mergen oder als PR prüfen.
2. Git-E-Mail bestätigen (`1-1@notify.easytechit.de`).
3. Registrierung und Login mit deinem Supabase-Projekt testen.
4. Playwright ist eingerichtet (`npm test`, 16 bestanden, 1 übersprungen). Session-Test mit Testkonto in einer Supabase-Testumgebung ausführen (`E2E_USER_EMAIL`, `E2E_USER_PASSWORD`).
5. CI-Workflow (`.github/workflows/`) mit Lint, Build und Tests einrichten.
6. GBFS-Validator: Repository und Lizenz prüfen, bevor er als Empfehlung gilt.

## Roadmap-Stand (Prompts 1 bis 12)

Prompts 1 bis 6 sind Konzept- und Dokumentationsschritte ohne Migrationen und ohne Supabase-Änderungen:

- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) und [ENVIRONMENT_CONFIGURATION.md](./ENVIRONMENT_CONFIGURATION.md) (Prompt 1)
- [DATABASE_MODEL.md](./DATABASE_MODEL.md) (Prompt 2)
- [RLS_POLICY_PLAN.md](./RLS_POLICY_PLAN.md) (Prompt 3)
- [SCORING_ENGINE.md](./SCORING_ENGINE.md) (Prompt 4, Parameter vorläufig)
- [MOBILITY_DATA_PLAN.md](./MOBILITY_DATA_PLAN.md) (Prompt 5)
- Designtokens Navy, Teal und Weiß in `app/globals.css` (Prompt 6, Commit `a2e6268`)

Prompts 7 bis 12:

- Prompt 7 (Startseite und Navigation): umgesetzt, Commit `935fb90`.
- Prompt 8 (Suche und Anbieterprofile): umgesetzt mit Demo-Daten, Commit `5524d4e`. Scores und Datenaktualität werden erst mit einer Datenbasis angezeigt.
- Prompt 9 (Stripe und Abonnements): Konzept in [PAYMENT_ARCHITECTURE.md](./PAYMENT_ARCHITECTURE.md) und [SUBSCRIPTION_MODEL.md](./SUBSCRIPTION_MODEL.md), Commit `24048f3`. Keine Zahlungen ausgelöst.
- Prompt 10 (B2B-Dashboard): Konzept in [B2B_DASHBOARD_CONCEPT.md](./B2B_DASHBOARD_CONCEPT.md), Commit `1719db9`. Umsetzung wartet auf Supabase-Datenbasis.
- Prompt 11 (Admin und Moderation): Architektur in [ADMIN_MODERATION_ARCHITECTURE.md](./ADMIN_MODERATION_ARCHITECTURE.md), Commit `1719db9`. Umsetzung erst nach Freigabe.
- Prompt 12 (Android-App): Grundlage in [ANDROID_APP_FOUNDATION.md](./ANDROID_APP_FOUNDATION.md), Commit `1719db9`. Keine Veröffentlichung ohne Freigabe.

Letzte Commits auf `feature/ai-skills`: `5524d4e`, `1719db9`, `24048f3`, `178a92c`, `935fb90`, `a2e6268`, `62fc2e2`, `50a2238`, `0df89b3`, `6efb49b`, `05cf6d3`.

Offen: Test-Runner für die Scoring-Engine (Vitest oder Playwright), Session-Test mit Supabase-Testprojekt, Freigaben für Prompts 11 und 12, Zahlungsdetails für Prompt 9 (Preise, Steuern, Erstattungen, Google-Play-Prüfung).

## Ergebnis MASTERPROMPT 4.0

- Vorhandene Agenten erweitert: `movora-architect`, `movora-frontend`, `movora-supabase`, `movora-qa-security`. Jeder hat jetzt Aufgaben, Nicht-Aufgaben, Zusammenarbeit, Dateibereiche, Sicherheitsregeln, Tests und Rückfragen.
- Neue Agenten: `movora-backend`, `movora-payments`, `movora-scoring`, `movora-tester`, `movora-mobile`.
- Neue Skills: `performance-and-scaling`, `android-mobile-capacitor`.
- Neue Prompts: `implement-feature`, `run-tests`.
- Defekte Verweise auf nicht vorhandene Dateien in `docs/` entfernt.
- Details und Prüfergebnisse: [AI_SETUP_REPORT.md](./AI_SETUP_REPORT.md).

## Ergebnis Sicherheitskorrektur (letzter Durchgang)

- Ungültige Supabase-Konfiguration (z. B. keine gültige URL) führt nicht mehr zu einem ungesicherten Absturz. `hasEnvVars` prüft URL und Key, Proxy und `requireClaims()` leiten bei Fehlern auf den Login um.
- Neuer Test `tests/e2e/invalid-env.spec.ts` deckt diesen Fall ab.
- Details: [PR_REVIEW_REPORT.md](./PR_REVIEW_REPORT.md) und [AI_SETUP_REPORT.md](./AI_SETUP_REPORT.md).

## Nächster Schritt

Vor dem Merge von PR #1: Merge-Freigabe durch den Nutzer. Danach Supabase-Testprojekt anbinden, Login und Registrierung testen und das Navy/Teal-Designsystem umsetzen. Phase 2 (Entwicklungsumgebung: `.vscode/`, `.editorconfig`, `.prettierrc`) folgt danach.
