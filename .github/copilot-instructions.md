# MOVORA – Copilot-Anweisungen

MOVORA ist eine Mobilitätsplattform. Next.js (App Router) mit React und TypeScript, Supabase für Datenbank, Auth und Storage, shadcn/ui für das Designsystem, MapLibre für Karten. Android folgt später über Ionic React und Capacitor.

## Vor jeder Änderung

1. [AGENTS.md](../AGENTS.md) lesen. Next.js 16 hat Breaking Changes. Vor dem Schreiben von Code die passende Anleitung in `node_modules/next/dist/docs/` prüfen.
2. Den passenden Skill in [.github/skills/](./skills/) lesen. Die Übersicht steht in [docs/AI_SKILLS.md](../docs/AI_SKILLS.md).
3. Den bestehenden Code prüfen. Vorhandene Komponenten, Hilfsfunktionen und Supabase-Helfer (`lib/supabase/`) wiederverwenden, nichts doppelt bauen.

## Regeln

- Bestehendes Repository erhalten. Keine fremden Starter-Repos ersetzen und keine Git-Historie überschreiben.
- Ein Framework, eine Datenbank (Supabase/PostgreSQL), eine Auth-Lösung, eine UI-Bibliothek (shadcn/ui).
- Kleine, gezielte Änderungen. Keine ungefragten Refactorings und keine unrelated Dateien anfassen.
- Keine Secrets in Code oder Commits. `.env.local` niemals ausgeben oder committen.
- Row Level Security ist bei jeder neuen Supabase-Tabelle Pflicht.
- Keine Produktionsdeployments ohne ausdrückliche Freigabe.
- Keine Emojis als Icons. Icons über `lucide-react`.
- Kein Nachbauen von Apple-Oberflächen oder -Marken. Das Designsystem ist eigenständig (Navy, Teal, Weiß).
- Kommentare nur, wenn etwas erklärungsbedürftig ist.

## Qualitätsprüfung vor dem Abschluss

- `npm run lint` fehlerfrei
- `npm run build` fehlerfrei
- Bei Auth- oder Datenänderungen: Login, Registrierung und geschützte Seiten manuell prüfen.
- Commit-Nachrichten mit Co-authored-by-Trailer.

## Rollen

Die Rollen und Prompts stehen in [docs/AI_SKILLS.md](../docs/AI_SKILLS.md). Feature-Umsetzung läuft über [implement-feature](./prompts/implement-feature.prompt.md) und die Agenten in [.github/agents/](./agents/). Jeder Agent nennt seine Dateibereiche und Pflichttests.
