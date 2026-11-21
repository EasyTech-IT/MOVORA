---
name: deployment-and-devops
description: Git-Workflow, Branches, Pull Requests, GitHub Actions, CI/CD, Umgebungsvariablen, Secrets und Rollback für MOVORA. Verwenden bei Commits, Pull Requests, Pipelines und Deployments.
---

# Deployment und DevOps

## Wann einsetzen
- Commit, Branch oder Pull Request anlegen.
- GitHub-Actions-Workflow ändern.
- Umgebungsvariablen oder Deployment vorbereiten.

## Zuerst lesen
1. [.gitignore](../../../.gitignore) (`.env*.local` und Build-Ordner).
2. [.env.example](../../../.env.example) (Variablen ohne Werte).
3. Vorhandene Workflows unter `.github/workflows/` (falls vorhanden).

## Fachliche Regeln
- Produktive Deployments nur nach ausdrücklicher Freigabe des Nutzers.
- Keine Commits auf `main` mit ungeprüften Änderungen. Änderungen über Branch und Pull Request.
- Git-Historie bleibt erhalten. Keine History-Umschreibung auf `main`.
- Commits klein und nachvollziehbar, mit klarer Nachricht.
- Development und Production haben getrennte Supabase-Projekte und Schlüssel.
- Secrets nur in GitHub Secrets oder im Hosting-Anbieter, nie im Repository.

## Arbeitsablauf
1. Branch anlegen (`feature/<kurzname>`).
2. Lint, Typen, Build und Tests lokal ausführen.
3. Commit mit Co-authored-by-Trailer (siehe Projekt-Anweisungen).
4. Push und Pull Request erstellen.
5. CI-Ergebnis prüfen. Deployment erst nach Freigabe.
6. Rollback-Plan notieren (vorheriger Commit, Datenbank-Migration rückgängig).

## Bibliotheken und Werkzeuge
Git, GitHub Actions, GitHub CLI, Node 20 oder neuer, npm.

## Sicherheitsregeln
- GitHub Secret Scanning und Branch Protection auf `main` aktivieren (manuell).
- Workflows mit minimalen `permissions:` schreiben.
- Keine Secrets in Logs ausgeben.

## Typische Fehler
- `.env.local` committet.
- Produktionsschlüssel in Development-Umgebung verwendet.
- Direktes Pushen auf `main` ohne Prüfung.
- Migration ohne Rollback-Plan.

## Qualitätskontrolle
- CI-Workflow grün vor dem Merge.
- Keine Secrets im Diff.

## Definition of Done
- Änderung über Pull Request mit grüner CI gemergt.
- Umgebungsvariablen dokumentiert, keine Werte im Repository.
- Deployment nur mit Freigabe durchgeführt.
