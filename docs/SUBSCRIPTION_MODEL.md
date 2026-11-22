# MOVORA – Abonnement-Modell (Konzept)

> **Status: Konzept.** Preise sind bewusst nicht festgelegt. Die technische Grundlage steht in [PAYMENT_ARCHITECTURE.md](./PAYMENT_ARCHITECTURE.md).

## 1. Ziel

Ein klares Modell, das festlegt, wer was sieht und was bezahlt werden kann, ohne öffentliche Scores zu beeinflussen. Zahlung darf nie bessere öffentliche Bewertungen oder Scores bewirken.

## 2. Pläne

### B2C (Nutzer)

| Plan | Zielgruppe | Inhalt (Entwurf) |
| --- | --- | --- |
| Free | Alle angemeldeten Nutzer | Suche, Anbieterprofile, eigene Bewertungen, öffentliche Scores |
| MOVORA Premium | Vielnutzer | Erweiterte Historie, Score-Verlauf, Favoriten mit Benachrichtigungen, Export eigener Daten |

Abrechnung: monatlich oder jährlich (Preise offen).

### B2B (Organisationen)

| Plan | Zielgruppe | Inhalt (Entwurf) |
| --- | --- | --- |
| Business Starter | Kleine Anbieter, Analysten | Eigenes Dashboard, Basisberichte, 1 Standort |
| Business Professional | Verkehrsunternehmen | Vergleichsansichten, CSV- und PDF-Export, Teamverwaltung |
| Business Enterprise | Große Betreiber | Erweiterte Rollen, mehrere Organisationen, Support-Vereinbarung |

Die Preise werden später festgelegt.

## 3. Feature-Matrix (Entitlements)

| Feature-Code | Free | Premium | Business Starter | Business Professional | Business Enterprise |
| --- | --- | --- | --- | --- | --- |
| `search.public` | ja | ja | ja | ja | ja |
| `provider.profile` | ja | ja | ja | ja | ja |
| `ratings.write` | ja | ja | nein (*) | nein (*) | nein (*) |
| `score.history` | begrenzt | voll | voll | voll | voll |
| `favorites.notify` | nein | ja | nein | nein | nein |
| `dashboard.b2b` | nein | nein | ja | ja | ja |
| `report.export` | nein | nein | CSV | CSV, PDF | CSV, PDF |
| `team.manage` | nein | nein | nein | ja | ja |

(*) Anbieter und deren Mitarbeitende dürfen keine Bewertungen für eigene Linien abgeben. Diese Regel gilt unabhängig vom Plan.

Der Plan bestimmt nur, welche Funktionen **sichtbar und nutzbar** sind. Er beeinflusst nie Score-Berechnung, Rohdaten oder Moderation.

## 4. Lebenszyklus für Nutzer

- **Upgrade:** sofort, Entitlement aktiv nach bestätigtem Webhook-Event.
- **Downgrade:** zum Laufzeitende, Funktionen bleiben bis dahin.
- **Kündigung:** über das Customer Portal, Zugriff bis `current_period_end`.
- **Zahlungsfehler:** Schonfrist, danach Entitlement entzogen. Daten bleiben erhalten.
- **Konto löschen:** Abo vorher kündigen. Bewertungen werden anonymisiert (siehe [DATABASE_MODEL.md](./DATABASE_MODEL.md)).

## 5. Regeln für Business-Kunden (aus dem Prompt)

B2B-Kunden dürfen:

- eigene Daten und Analysen sehen,
- Berichte exportieren,
- eigene Organisationsmitglieder verwalten, soweit berechtigt.

B2B-Kunden dürfen **nicht**:

- Community-Bewertungen löschen,
- Scores manipulieren,
- negative Bewertungen unterdrücken,
- durch Zahlung bessere öffentliche Scores erhalten.

Technisch umgesetzt durch: Der Plan wirkt nur auf Feature-Entitlements. Schreibrechte auf `ratings` und `score_snapshots` gibt es für Anbieter nicht (siehe [RLS_POLICY_PLAN.md](./RLS_POLICY_PLAN.md)).

## 6. Testabdeckung (Abnahme)

- Entitlement ohne aktives Abo wird verweigert (serverseitig).
- Webhook-Event doppelt gesendet, nur eine Wirkung.
- Ungültige Webhook-Signatur wird abgewiesen.
- Business-Nutzer kann keine Bewertung eigener Linien anlegen.
- Kündigung zum Laufzeitende behält Zugriff bis dahin.

## 7. Offene Punkte

- Preise, Laufzeiten und Testphase.
- Feature-Umfang der Pläne bestätigen.
- Rechnungs- und Steuerfragen (siehe PAYMENT_ARCHITECTURE).
- Rechtliche Prüfung der Play-Richtlinie vor Android-Release.
