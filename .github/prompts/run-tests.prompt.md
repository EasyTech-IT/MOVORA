---
description: Führt alle MOVORA-Prüfungen aus und meldet die Ergebnisse ehrlich.
---

Führe die Prüfungen für MOVORA aus und berichte jedes Ergebnis einzeln.

1. `npm run lint`
2. `npx tsc --noEmit`
3. `npm run build`
4. Tests, sofern vorhanden (Skript `test` in `package.json`). Falls kein Testskript existiert, als "nicht vorhanden" melden und nicht als bestanden werten.
5. Ergebnisse je Schritt: Befehl, Ergebnis, Fehlerauszug bei Fehlern.

Behebe keine Fehler in dieser Phase. Fehler an den zuständigen Agenten geben, siehe [movora-tester](../agents/movora-tester.agent.md).
