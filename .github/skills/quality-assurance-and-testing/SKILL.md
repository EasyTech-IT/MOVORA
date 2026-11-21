---
name: quality-assurance-and-testing
description: Qualitätssicherung für MOVORA mit Lint, TypeScript, Build, Playwright-End-to-End-Tests, Responsive- und Accessibility-Prüfungen sowie Regressionstests. Verwenden vor dem Abschluss jeder Funktion.
---

# Qualitätssicherung und Tests

## Wann einsetzen
- Vor dem Abschluss jeder Funktion oder Änderung.
- Nach Fehlermeldungen oder vor einem Merge.
- Bei Änderungen an Auth, Daten, Karten oder Zahlungen.

## Zuerst lesen
1. [package.json](../../../package.json) (vorhandene Skripte).
2. [eslint.config.mjs](../../../eslint.config.mjs) und [tsconfig.json](../../../tsconfig.json).
3. Vorhandene Testdateien (falls angelegt).

## Fachliche Regeln
- Keine Funktion gilt als fertig ohne Lint, Typprüfung und Build.
- Kritische Flows (Login, Registrierung, Zahlung, Karte) bekommen Playwright-Tests.
- Bugfixes bekommen einen Regressionstest.
- Tests prüfen Verhalten, nicht Implementierungsdetails oder Konstanten.
- Keine Fake-Daten als Testergebnis ausgeben. Testdaten klar kennzeichnen.

## Arbeitsablauf
1. `npm run lint`
2. `npx tsc --noEmit`
3. `npm run build`
4. Playwright-Test für geänderte Flows ausführen.
5. Responsive (375, 768, 1280 px) und Tastatur prüfen.
6. Fehler analysieren, Ursache beheben, nicht nur Symptom.

## Bibliotheken und Werkzeuge
Playwright (`@playwright/test`), ESLint, TypeScript, Next.js Build. Playwright wird bei Bedarf als Dev-Abhängigkeit ergänzt (Installation nach Begründung).

## Sicherheitsregeln
- Tests nutzen eigene Testkonten, keine echten Nutzerdaten.
- Testzugangsdaten nur als Umgebungsvariablen.

## Typische Fehler
- Nur Build getestet, Laufzeitfehler übersehen.
- Tests, die immer grün sind (keine echte Assertion).
- Flaky Tests ignoriert statt ursächlich behoben.

## Qualitätskontrolle
- Alle Befehle grün und Ergebnis dokumentiert.
- Mindestens ein End-to-End-Test für neue Nutzerflows.

## Definition of Done
- Lint, Typen und Build fehlerfrei.
- Relevante Tests vorhanden und grün.
- Bekannte Einschränkungen dokumentiert.
