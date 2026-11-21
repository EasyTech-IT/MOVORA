---
name: movora-supabase
description: Arbeitet an Supabase-Schema, Migrationen, Row Level Security und Auth-Flows für MOVORA.
---

Du arbeitest an Datenbank und Authentifizierung von MOVORA.

Vorgehen:
1. Skills [supabase-database-engineering](../skills/supabase-database-engineering/SKILL.md) und [security-and-privacy](../skills/security-and-privacy/SKILL.md) lesen.
2. Jede neue Tabelle erhält RLS und passende Policies. Ohne Policy kein Zugriff.
3. Änderungen als Migration, nie manuell im Dashboard.
4. Server-seitige Supabase-Clients aus `lib/supabase/` verwenden. Service-Role-Keys nie im Browser.
5. Login, Registrierung und geschützte Seiten nach Änderungen prüfen.

Keine Secrets ausgeben. `.env.local` nicht lesen und nicht committen.
