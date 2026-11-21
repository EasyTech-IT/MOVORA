# PR-Review: feature/ai-skills → main (PR #1)

Stand: nach Korrekturen auf `feature/ai-skills`. Nichts wurde gemerged, `main` wurde nicht verändert.

## Geprüfte Punkte

| # | Prüfpunkt | Ergebnis |
|---|---|---|
| 1 | Agenten korrekt aufgebaut | Frontmatter mit `name` und `description` vorhanden. Dateien sind UTF-8 ohne Mojibake. Erkennung durch Copilot in VS Code ist **nicht getestet**. |
| 2 | Skills nutzbar | 14 Verzeichnisse mit `SKILL.md`. Format konsistent. Erkennung ebenfalls nicht im Chat geprüft. |
| 3 | Widersprüche und Doppelungen | Keine widersprüchlichen Regeln gefunden. Die Rollen sind über `docs/AI_SKILLS.md` abgegrenzt. |
| 4 | Playwright-Tests fachlich korrekt | Die Tests prüfen Erreichbarkeit, Navigation und die Weiterleitung von `/protected`. Ein Login mit Zugangsdaten wird nicht getestet (bewusst). |
| 5 | Serverseitiger Schutz | Der Proxy (`lib/supabase/proxy.ts`) prüft Claims serverseitig. `app/protected/page.tsx` prüft ebenfalls serverseitig. |
| 6 | Test- und Produktionstrennung | `PLAYWRIGHT_BASE_URL` erlaubt Tests gegen eine andere Umgebung. Es gibt keine Produktionszugangsdaten im Repo. |
| 7 | Secrets | Suche nach Keys, Tokens und Service-Role-Strings ohne Treffer. `.env.local` ist git-ignoriert. |
| 8 | Starter-Reste | Vorhanden (siehe Mittelschwere Probleme). |
| 9 | Notwendigkeit der Änderungen | Alle Änderungen gehören zum Ziel der KI-Struktur und der E2E-Basis. |
| 10 | Build, Deployment, Erweiterbarkeit | Build läuft. Es gibt keine CI-Pipeline (siehe Mittelschwere Probleme). |

## Kritische Probleme

### K1: Fail-open im Auth-Proxy (behoben)

- **Ort:** `lib/supabase/proxy.ts`
- **Problem:** Fehlten die Supabase-Env-Variablen, gab `updateSession` früh `next()` zurück. Dann wurden auch geschützte Routen ohne Login ausgeliefert.
- **Fix:** Ohne Env-Variablen leitet der Proxy alle nicht-öffentlichen Pfade auf `/auth/login` um. Öffentliche Pfade (`/`, `/login*`, `/auth*`) bleiben erreichbar. Der Supabase-Client wird ohne Konfiguration nicht erzeugt.
- **Einschränkung:** Die Playwright-Suite läuft mit den lokalen Env-Variablen. Der Fail-closed-Zweig wird dadurch nicht automatisch getestet.

## Mittelschwere Probleme

### M1: Geschützte Seite rendert die statische Hülle vor dem Login-Check

- **Ort:** `app/protected/page.tsx`
- **Problem:** Die statische Hülle mit `FetchDataSteps` wird ausgeliefert, bevor `UserDetails` die Claims prüft. Der Proxy fängt das im Normalfall ab. Trotzdem sollte die Seite keine Inhalte vor der Prüfung zeigen.
- **Empfehlung:** Die gesamte Seite nach der Session-Prüfung rendern, sobald echte Inhalte hinzukommen.

### M2: Keine CI-Pipeline

- **Problem:** `.github/workflows` fehlt. Der Skill `deployment-and-devops` beschreibt CI, sie ist aber nicht umgesetzt. Tests und Lint laufen nur lokal.
- **Empfehlung:** Eigene Folge-Aufgabe mit Lint, Typecheck, Build und Playwright.

### M3: Starter-Reste in der Oberfläche

- **Ort:** `components/tutorial/*`, `app/page.tsx`, `app/protected/page.tsx`, `app/layout.tsx`, `components/tutorial/sign-up-user-steps.tsx`
- **Problem:** Tutorial-Komponenten und `VERCEL_*`-Abfragen stammen aus dem Starter. Die Startseite zeigt Tutorial-Schritte statt MOVORA-Inhalt.
- **Empfehlung:** Entfernen, sobald die MOVORA-Startseite steht. Vorher die Abhängigkeiten prüfen.

### M4: Veraltete Kommentare und Hilfsfunktion

- **Ort:** `lib/utils.ts`
- **Problem:** Der Kommentar „This check can be removed, it is just for tutorial purposes“ ist irreführend, weil `hasEnvVars` jetzt sicherheitsrelevant ist.
- **Empfehlung:** Kommentar anpassen, sobald die Umgebung steht.

## Kleinere Verbesserungsvorschläge

- **Doppelter „Sign up“-Link** auf der Startseite. Der Test grenzt das über die Navigation ab.
- **Git-Warnungen zu `core.autocrlf`** (LF → CRLF) bei `.gitignore`, `package.json`, `package-lock.json`. Keine inhaltliche Auswirkung.
- **Test-Abdeckung:** Der Fail-closed-Pfad aus K1 könnte mit einem Test ohne Env-Variablen geprüft werden. Dafür braucht es einen eigenen Webserver-Lauf.

## Bestätigte funktionierende Bereiche

- TypeScript (`tsc --noEmit`) ohne Fehler.
- ESLint ohne Fehler.
- Production Build erfolgreich, inklusive Proxy und Routen `/`, `/auth/*`, `/protected`.
- Playwright: 5/5 Tests bestanden.
- Keine Secrets in getrackten Dateien gefunden.
- `.env.local` ist git-ignoriert.
- Agenten und Skills sind UTF-8-kodiert, ohne Mojibake.

## Merge-Empfehlung

**Bedingt bereit.** Der kritische Fail-open ist behoben und alle technischen Prüfungen sind grün. Vor dem Merge sollte geklärt sein:

1. Die Änderung am Proxy (K1) ist freigegeben.
2. Die PR-Beschreibung ist auf GitHub aktualisiert.

Die mittelschweren Punkte (CI, Starter-Reste, Schutz der Seitenhülle) sind Folgeaufgaben und blockieren den Merge nicht.
