# MOVORA – Administration und Moderation (Architektur)

> **Status: teilweise implementiert (Prompt 11, freigegeben).** Umgesetzt: Rollen und Bereiche in `lib/admin/roles.ts`, serverseitige Prüfung in `lib/admin/guard.ts`, Routen `app/admin/` (Übersicht und Bereichsseiten ohne Aktionen), Migration `supabase/migrations/20260301000000_admin_roles_and_audit.sql`, E2E-Tests `tests/e2e/admin-routes.spec.ts`.
>
> Noch nicht umgesetzt: Moderationsaktionen, Meldungen, Einspruchsprozess und Schreibzugriffe. Die Migration ist **nicht angewendet**. Sie braucht ein Test-Supabase-Projekt. Der erste `super_admin` wird manuell per SQL vergeben.
>
> Entscheidung 404 oder Login: Angemeldete Nutzer ohne Rolle sehen 404. Anonyme Nutzer werden wie bei allen nicht öffentlichen Pfaden zum Login geleitet. So ist die Existenz von `/admin` nicht erkennbar.

## 1. Grundprinzipien

- Rollen werden **serverseitig** geprüft (Supabase RLS plus Prüfung in Server Actions und Route Handlern). Admin-Rechte werden nie allein im Frontend erzwungen.
- Jede kritische Aktion wird im Audit Log protokolliert (Akteur, Zeitpunkt, Aktion, Zielobjekt, Begründung, alter und neuer Wert).
- Mehrstufige Kontrolle: kritische Aktionen brauchen eine zweite Freigabe durch eine andere Person mit höherer Rolle.
- Keine willkürliche Löschung legitimer Kritik. Löschen ist nur mit dokumentiertem Regelverstoß und Begründung möglich.
- Admin-Aktionen wirken nie auf Scores direkt. Scores entstehen aus Daten und Regeln (siehe [SCORING_ENGINE.md](./SCORING_ENGINE.md)).

## 2. Rollen

| Rolle | Zweck | Vergabe |
| --- | --- | --- |
| `super_admin` | Systemverwaltung, Rollenvergabe | Manuell per Datenbank, nie per UI, mindestens zwei |
| `admin` | Benutzer, Anbieter, Datenquellen | Durch `super_admin` |
| `moderator` | Meldungen und Bewertungsmoderation | Durch `admin` |
| `data_operator` | Importstatus, Datenquellen, Score-Monitoring (nur lesen) | Durch `admin` |
| `support` | Benutzeranfragen, Einsicht ohne Änderungsrecht | Durch `admin` |
| `user` | Standard, keine Admin-Rechte | Automatisch |

Organisationsrollen aus [B2B_DASHBOARD_CONCEPT.md](./B2B_DASHBOARD_CONCEPT.md) sind getrennt. Ein B2B-Owner hat dadurch keine Admin-Rechte.

## 3. Rollenmatrix

Legende: **L** lesen, **S** schreiben, **F** Freigabe (Vier-Augen), **–** kein Zugriff.

| Bereich | user | support | moderator | data_operator | admin | super_admin |
| --- | --- | --- | --- | --- | --- | --- |
| Benutzerverwaltung (Profil, Sperre) | – | L | – | – | S, F bei Sperre | S, F |
| Rollenverwaltung | – | – | – | – | L | S, F |
| Anbieterverwaltung | – | L | L | L | S | S |
| Mobilitätsdatenquellen | – | – | – | S | S | S |
| Importstatus | – | – | – | S (neu starten) | L | L |
| Bewertungsmoderation | – | – | S (ausblenden, prüfen) | – | S | S |
| Meldungen | eigene einreichen | L | S | – | S | S |
| Score-Monitoring | – | – | – | L | L | L |
| Abonnements (Status) | eigene | L | – | – | L | L, S (Support-Fall, F) |
| Audit Log | – | – | – | – | L | L |

Nicht erlaubt für **alle** Rollen, auch `super_admin`: Scores manuell setzen, Bewertungen ohne Moderationsfall löschen, Abonnement-Entitlements ohne Stripe-Ereignis setzen, Audit-Einträge ändern oder löschen.

## 4. Bereiche und Routen

Alle Routen liegen unter `/admin` und sind serverseitig geschützt. Ohne passende Rolle antwortet der Server mit 404, nicht mit einer Anmeldeaufforderung, damit die Existenz des Bereichs nicht sichtbar ist.

| Route | Bereich | Mindestrolle |
| --- | --- | --- |
| `/admin/benutzer` | Benutzerverwaltung | support |
| `/admin/rollen` | Rollenverwaltung | admin |
| `/admin/anbieter` | Anbieterverwaltung | moderator |
| `/admin/datenquellen` | Quellen und Importstatus | data_operator |
| `/admin/moderation` | Bewertungsmoderation | moderator |
| `/admin/meldungen` | Meldungen | moderator |
| `/admin/scores` | Score-Monitoring | data_operator |
| `/admin/abos` | Abonnement-Status | support |
| `/admin/audit` | Audit Log | admin |

## 5. Moderationsprozess

1. **Meldung einreichen:** angemeldete Nutzer, mit Grund aus fester Liste (Spam, Beleidigung, falsche Tatsache, Datenschutz, Sonstiges). Eine Person kann pro Bewertung nur einmal melden.
2. **Triage:** Meldungen mit Datenschutzgrund haben Vorrang.
3. **Prüfung:** Moderator sieht Bewertung, Meldung und Verlauf. Die Entscheidung wird mit Begründung dokumentiert.
4. **Maßnahme:** `keine`, `ausgeblendet` (sichtbar nur für Autor und Moderation), `entfernt`, `Hinweis an Autor`. Ausblenden ist reversibel. Entfernen braucht Begründung und bei Anbieter-Bezug eine Freigabe durch `admin`.
5. **Einspruch:** Autor und betroffene Anbieter können innerhalb von 14 Tagen Einspruch einlegen. Ein anderer Moderator entscheidet neu.
6. **Protokoll:** jeder Schritt erzeugt einen Audit-Eintrag.

Kritik bleibt sichtbar, solange kein Regelverstoß festgestellt ist. Sachliche negative Bewertungen dürfen nicht entfernt werden.

## 6. Audit Log

Felder: `id`, `actor_id`, `actor_role`, `action`, `target_type`, `target_id`, `reason`, `before` (JSON), `after` (JSON), `created_at`.

- Nur Insert per Server-Funktion. Kein Update, kein Delete (RLS verweigert beides, auch für `super_admin`).
- Aufbewahrung nach Datenschutz-Konzept festlegen (offen).
- Personenbezogene Daten im Log minimieren (IDs statt Klartext).

## 7. Sicherheitskontrollen

- Admin-Aktionen nur über Server Actions mit Prüfung der Rolle aus der Datenbank, nicht aus dem JWT-Claim allein.
- Sitzungsablauf für Admin-Bereich kürzer als für Nutzer (Empfehlung: 30 Minuten Inaktivität, offen).
- Zwei-Faktor-Authentifizierung für `admin` und `super_admin` (Supabase MFA, vor Produktivbetrieb Pflicht).
- Rate Limit auf Moderationsaktionen.
- Tests: jede Route mit jeder Rolle, Zugriff ohne Rolle, Versuch Audit-Einträge zu ändern.

## 8. Umsetzungsreihenfolge (nach Freigabe)

1. Rollen-Tabelle, RLS und Audit Log (mit Tests).
2. Benutzer und Rollen.
3. Anbieter und Datenquellen (Status nur lesen).
4. Meldungen und Moderation.
5. Score-Monitoring und Abo-Status.

## 9. Offene Punkte für Ihre Freigabe

- Anzahl `super_admin` und Vergabeprozess.
- Aufbewahrungsfrist des Audit Logs.
- Session-Dauer und MFA-Pflicht.
- Ob Einsprüche auch extern (per E-Mail) eingereicht werden dürfen.
