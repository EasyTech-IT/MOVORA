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
- **Test:** `tests/e2e/missing-env.spec.ts` läuft gegen einen zweiten Webserver (Port 3001) ohne Env-Variablen. Dort prüfen drei Tests den Fail-closed-Zweig.
- **Einschränkung:** Ein ungültiger (nicht fehlender) Auth-Konfigurationswert, etwa ein falscher Key, wird nicht E2E-getestet. Er führt zur Weiterleitung auf den Login, weil `requireClaims()` bei Fehlern redirectet.

### K2: Sicherheit hing nur am Proxy (behoben)

- **Ort:** `app/protected/page.tsx`, `lib/supabase/require-claims.ts` (neu)
- **Problem:** Die Seite war statisch und nur der Proxy schützte sie.
- **Fix:** `requireClaims()` prüft serverseitig über `auth.getClaims()`. Ohne Env-Variablen, bei Fehlern oder ohne Claims erfolgt eine Weiterleitung auf `/auth/login`. Die Seite rendert den Inhalt erst danach. Damit hängt die Sicherheit nicht allein am Proxy.

## Mittelschwere Probleme

### M1: Geschützte Seite rendert die statische Hülle vor dem Login-Check (behoben)

- **Ort:** `app/protected/page.tsx`
- **Fix:** Die Seite ruft `requireClaims()` vor jedem Inhalt auf. Die statische Tutorial-Hülle wurde entfernt.

### M2: Keine CI-Pipeline

- **Problem:** `.github/workflows` fehlt. Der Skill `deployment-and-devops` beschreibt CI, sie ist aber nicht umgesetzt. Tests und Lint laufen nur lokal.
- **Empfehlung:** Eigene Folge-Aufgabe mit Lint, Typecheck, Build und Playwright.

### M3: Starter-Reste in der Oberfläche

- **Ort:** `components/tutorial/*`, `app/page.tsx`, `app/protected/page.tsx`, `app/layout.tsx`, `components/tutorial/sign-up-user-steps.tsx`
- **Problem:** Tutorial-Komponenten und `VERCEL_*`-Abfragen stammen aus dem Starter. Die Startseite zeigt Tutorial-Schritte statt MOVORA-Inhalt.
- **Empfehlung:** Entfernen, sobald die MOVORA-Startseite steht. Vorher die Abhängigkeiten prüfen.

### M4: Veraltete Kommentare und Hilfsfunktion (behoben)

- **Ort:** `lib/utils.ts`
- **Fix:** Der Kommentar beschreibt jetzt die Fail-closed-Funktion von `hasEnvVars`.

## Kleinere Verbesserungsvorschläge

- **Doppelter „Sign up“-Link** auf der Startseite. Der Test grenzt das über die Navigation ab.
- **Git-Warnungen zu `core.autocrlf`** (LF → CRLF) bei `.gitignore`, `package.json`, `package-lock.json`. Keine inhaltliche Auswirkung.
- **Test-Abdeckung (erledigt):** Der Fail-closed-Pfad aus K1 wird jetzt über den Webserver ohne Env-Variablen getestet.
- **Valid-Session-Test:** `tests/e2e/authenticated.spec.ts` ist übersprungen, solange `E2E_USER_EMAIL` und `E2E_USER_PASSWORD` fehlen. Er braucht ein eigenes Supabase-Testprojekt.
- **GBFS-Validator:** Der konkrete Validator ist noch nicht verifiziert. Vor der Nutzung Repository und Lizenz prüfen.

## Bestätigte funktionierende Bereiche

- TypeScript (`tsc --noEmit`) ohne Fehler.
- ESLint ohne Fehler.
- Production Build erfolgreich, inklusive Proxy und Routen `/`, `/auth/*`, `/protected`.
- Playwright: 8 bestanden, 1 übersprungen (Valid-Session-Test ohne `E2E_USER_*`).
- Prüfung der Copilot-Review-Hinweise: Migrationen (Payments/Scoring definieren Anforderungen, `movora-supabase` erstellt und prüft) und Feed-Validierung (GTFS Schedule mit dem GTFS Validator, GTFS-RT/GBFS/Geodaten mit passenden Validatoren oder Schemas) sind in Agenten, Skills, Prompt und Dokumentation korrigiert.
- Keine Secrets in getrackten Dateien gefunden.
- `.env.local` ist git-ignoriert.
- Agenten und Skills sind UTF-8-kodiert, ohne Mojibake.

## Merge-Empfehlung

**Technisch bereit für den Merge, nach manueller Freigabe.** K1 und K2 sind behoben, Typecheck, Lint, Build und die Playwright-Tests sind grün. Vor dem Merge sollte geklärt sein:

1. Die PR-Beschreibung ist auf GitHub aktualisiert.
2. Der Valid-Session-Test ist offen. Er läuft erst mit einem Supabase-Testprojekt.

Offen bleiben CI (M2) und Starter-Reste (M3). Sie sind Folgeaufgaben und blockieren den Merge nicht.
