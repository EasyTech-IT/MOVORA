# MOVORA – Skill-Übersicht

Die Skills liegen unter [.github/skills/](../.github/skills/). Jeder Skill ist eine `SKILL.md` mit Anwendungsfall, Geschäftsregeln, Arbeitsablauf, Sicherheitsregeln, typischen Fehlern und Definition of Done.

| Skill | Zweck |
|---|---|
| [movora-product-architecture](../.github/skills/movora-product-architecture/SKILL.md) | Produktumfang, Module und Architekturentscheidungen |
| [supabase-database-engineering](../.github/skills/supabase-database-engineering/SKILL.md) | Schema, Migrationen, RLS, Indizes |
| [movora-scoring-engine](../.github/skills/movora-scoring-engine/SKILL.md) | Bewertungslogik (vorläufige Gewichtung, nicht als final behandeln) |
| [mobility-data-engineering](../.github/skills/mobility-data-engineering/SKILL.md) | GTFS/GBFS-Import, Validierung mit GTFS Validator |
| [apple-inspired-design-system](../.github/skills/apple-inspired-design-system/SKILL.md) | Designsystem (Navy, Teal, Weiß), Typografie, Abstände |
| [motion-design-and-interactions](../.github/skills/motion-design-and-interactions/SKILL.md) | Übergänge und Interaktionen, dezent und zweckgebunden |
| [frontend-engineering](../.github/skills/frontend-engineering/SKILL.md) | Next.js, React, shadcn/ui, MapLibre-Integration |
| [stripe-and-subscriptions](../.github/skills/stripe-and-subscriptions/SKILL.md) | Zahlungen und Abos, Anpassung an Supabase |
| [security-and-privacy](../.github/skills/security-and-privacy/SKILL.md) | Auth, Secrets, Datenschutz |
| [quality-assurance-and-testing](../.github/skills/quality-assurance-and-testing/SKILL.md) | Lint, Build, Tests, Playwright |
| [open-source-integration](../.github/skills/open-source-integration/SKILL.md) | Prüfung und Dokumentation neuer Open-Source-Bausteine |
| [deployment-and-devops](../.github/skills/deployment-and-devops/SKILL.md) | Umgebungen, GitHub Actions, Deployment (nur mit Freigabe) |
| [performance-and-scaling](../.github/skills/performance-and-scaling/SKILL.md) | Messung, Datenbankindizes, Kartenlast, Caching, Lasttests (neu) |
| [android-mobile-capacitor](../.github/skills/android-mobile-capacitor/SKILL.md) | Android-App mit Ionic React und Capacitor (neu) |

## Agenten

| Agent | Zweck | Status |
|---|---|---|
| [movora-architect](../.github/agents/movora-architect.agent.md) | Planung, Arbeitspakete, Konflikte | erweitert |
| [movora-frontend](../.github/agents/movora-frontend.agent.md) | Oberflächen, Karten, Formulare | erweitert |
| [movora-supabase](../.github/agents/movora-supabase.agent.md) | Schema, Migrationen, RLS, Auth | erweitert |
| [movora-qa-security](../.github/agents/movora-qa-security.agent.md) | Code Review, Sicherheit, Datenschutz, Score-Prüfung | erweitert |
| [movora-backend](../.github/agents/movora-backend.agent.md) | Route Handlers, Server Actions, Imports, API | neu |
| [movora-payments](../.github/agents/movora-payments.agent.md) | Stripe, Webhooks, Entitlements | neu |
| [movora-scoring](../.github/agents/movora-scoring.agent.md) | Bewertungslogik und Mindeststichproben | neu |
| [movora-tester](../.github/agents/movora-tester.agent.md) | Testausführung und Test-Automatisierung | neu |
| [movora-mobile](../.github/agents/movora-mobile.agent.md) | Android mit Capacitor | neu |

## Prompts

| Prompt | Zweck | Status |
|---|---|---|
| [plan-feature](../.github/prompts/plan-feature.prompt.md) | Feature planen, ohne Code | vorhanden |
| [review-security](../.github/prompts/review-security.prompt.md) | Sicherheitsprüfung | vorhanden |
| [add-gtfs-source](../.github/prompts/add-gtfs-source.prompt.md) | GTFS-Quelle anbinden | vorhanden |
| [implement-feature](../.github/prompts/implement-feature.prompt.md) | Freigegebenen Plan über die Agenten umsetzen | neu |
| [run-tests](../.github/prompts/run-tests.prompt.md) | Lint, Typen, Build und Tests ausführen | neu |

## Weitere Dateien

- Projektregeln: [.github/copilot-instructions.md](../.github/copilot-instructions.md)
- Projektstand: [PROJECT_AUDIT.md](./PROJECT_AUDIT.md)
- Einrichtungsbericht: [AI_SETUP_REPORT.md](./AI_SETUP_REPORT.md)


## Pflege

Skills ändern sich mit dem Code. Wird eine Regel geändert, den betroffenen Skill im selben Commit anpassen.
