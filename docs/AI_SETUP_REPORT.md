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
| Tests | kein Testskript in `package.json` vorhanden, daher nicht ausgeführt |
| Erkennung der Rollen durch Copilot | nicht geprüft. Es ist eine Sichtprüfung im VS-Code-Chat nötig. |

## 6. Offene Punkte

- Ein Testframework und Playwright fehlen. Dafür ist eine Freigabe nötig, weil neue Dev-Abhängigkeiten eingeführt werden.
- Login und Registrierung mit echtem Supabase-Projekt sind nicht getestet.
- Git-E-Mail `1-1@notify.easytechit.de` ist nicht bestätigt.
- Der Feature-Branch ist nicht nach `main` gemergt.
- Starter-Reste (`components/tutorial/*`, `VERCEL_*`-Abfragen) sind noch vorhanden.
- Designsystem Navy/Teal ist noch nicht in `app/globals.css` umgesetzt.

## 7. Nächste Schritte

1. Rollenerkennung im VS-Code-Chat prüfen (`/agents`, Prompts über `/`).
2. Testframework nach Freigabe einrichten, danach `run-tests` mit echtem Testskript ausführen.
3. Supabase-Login mit Testkonto prüfen.
4. Feature-Branch per PR prüfen und danach entscheiden, ob er nach `main` geht.
