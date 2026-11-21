# MOVORA

Mobilitätsplattform auf Basis von Next.js, Supabase, shadcn/ui und MapLibre.

## Tech-Stack

| Bereich | Technologie |
|---|---|
| Web-App | Next.js (App Router, React 19, TypeScript) |
| Datenbank & Auth | Supabase (PostgreSQL, Supabase Auth, SSR via `@supabase/ssr`) |
| UI | shadcn/ui + Tailwind CSS (Komponenten in `components/ui`) |
| Karten | MapLibre GL JS (vorbereitet: `components/map.tsx`) |
| Icons | lucide-react |

Alle verwendeten Open-Source-Komponenten, Lizenzen und offene Integrationen: [docs/OPEN_SOURCE_COMPONENTS.md](./docs/OPEN_SOURCE_COMPONENTS.md)

## Einrichtung

1. Abhängigkeiten installieren:

   ```bash
   npm install
   ```

2. Supabase-Projekt anlegen unter https://database.new und Zugangsdaten eintragen:

   ```bash
   cp .env.example .env.local
   ```

   In `.env.local` eintragen (aus Supabase: Project Settings → API):

   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
   ```

3. Entwicklungsserver starten:

   ```bash
   npm run dev
   ```

   App läuft unter http://localhost:3000

## Bereits enthaltene Funktionen

- Registrierung, Login, Passwort vergessen/ändern, E-Mail-Bestätigung (`app/auth`)
- Geschützter Bereich (`app/protected`)
- Cookie-basierte serverseitige Authentifizierung (`proxy.ts`, `lib/supabase`)
- Dark Mode (next-themes)
- UI-Basiskomponenten: Button, Card, Input, Label, Checkbox, Badge, Dropdown, Dialog, Table, Tabs, Select

## Skripte

| Befehl | Beschreibung |
|---|---|
| `npm run dev` | Entwicklungsserver |
| `npm run build` | Produktions-Build |
| `npm start` | Produktionsserver |
| `npm run lint` | Linting |
