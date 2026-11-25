---
description: Setzt ein freigegebenes MOVORA-Feature über die passenden Agenten um.
---

Setze das Feature `${input:feature:Freigegebenes Feature beschreiben}` für MOVORA um. Voraussetzung: Es gibt einen freigegebenen Plan aus [plan-feature](./plan-feature.prompt.md).

1. Plan prüfen. Ohne Freigabe nicht fortfahren.
2. Arbeitspakete nach Bereich zuordnen:
   - Datenbank und Auth: [movora-supabase](../agents/movora-supabase.agent.md)
   - API und Serverlogik: [movora-backend](../agents/movora-backend.agent.md)
   - Oberfläche: [movora-frontend](../agents/movora-frontend.agent.md)
   - Zahlungen: [movora-payments](../agents/movora-payments.agent.md)
   - Bewertungen: [movora-scoring](../agents/movora-scoring.agent.md)
   - Android: [movora-mobile](../agents/movora-mobile.agent.md)
3. Pakete nacheinander umsetzen. Datenbank vor Backend, Backend vor Oberfläche. Jeder Agent ändert nur seine Dateien.
4. Tests über [movora-tester](../agents/movora-tester.agent.md) ausführen. Lint, Typen und Build müssen grün sein.
5. Prüfung über [movora-qa-security](../agents/movora-qa-security.agent.md). Kritische Befunde vor dem Abschluss beheben.
6. Zusammenfassung: geänderte Dateien, Testergebnisse, offene Punkte. Commit nur auf dem Feature-Branch, nie direkt auf `main`.
