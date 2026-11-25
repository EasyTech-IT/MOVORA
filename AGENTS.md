<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# MOVORA – Agenten-Anweisungen

- Projektregeln stehen in [.github/copilot-instructions.md](./.github/copilot-instructions.md).
- Fachliche Skills liegen in [.github/skills/](./.github/skills/). Übersicht: [docs/AI_SKILLS.md](./docs/AI_SKILLS.md).
- Herkunft und Lizenzen der Open-Source-Bausteine: [docs/OPEN_SOURCE_COMPONENTS.md](./docs/OPEN_SOURCE_COMPONENTS.md).
- Stack: Next.js (App Router), React, TypeScript, Supabase (Auth, PostgreSQL, RLS), shadcn/ui, Tailwind CSS, MapLibre GL JS.
- Befehle: `npm run dev`, `npm run lint`, `npm run build`.
- Secrets liegen in `.env.local` (git-ignoriert). Niemals ausgeben oder committen.
