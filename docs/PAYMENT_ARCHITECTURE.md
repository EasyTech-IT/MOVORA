# MOVORA – Zahlungsarchitektur (Konzept)

> **Status: Konzept.** Es werden keine Zahlungen ausgelöst, keine Stripe-Konten verbunden und keine Migrationen erstellt. Die Umsetzung braucht eine Freigabe.

## 1. Grundsätze

- Berechtigungen (Entitlements) werden **ausschließlich serverseitig** geprüft.
- Stripe Secret Keys bleiben auf dem Server. Im Frontend nur der Publishable Key.
- Keine Premium-Freischaltung allein aus Client-State.
- Webhooks werden mit Signatur geprüft und idempotent verarbeitet (jedes Event-ID einmal).
- Erst Testmodus (Stripe Test Mode mit eigenem Testprojekt), danach Live-Modus. Live-Schlüssel nur über sichere Umgebungsvariablen oder GitHub Secrets.
- Keine produktiven Daten oder echte Kundenkonten in der Entwicklung.

## 2. Zwei getrennte Zahlungswege

| Kanal | Zahlungsweg | Grund |
| --- | --- | --- |
| Web (B2C und B2B) | Stripe Checkout, Customer Portal | Digitale Dienste im Browser |
| Android-App (digitale Premium-Funktionen) | **Google Play Billing** | Google-Richtlinie: In-App-Käufe digitaler Inhalte und Funktionen einer Play-App müssen über Google Play Billing laufen. |

Wichtig: Stripe darf in der Android-App **nicht** für digitale Premium-Funktionen verwendet werden. Die Richtlinie gilt auch für eigene Apps des Anbieters. Ausnahmen (zum Beispiel physische Dienste wie Fahrkarten) betreffen MOVORA-Premium nicht. Vor der Umsetzung muss die Konformität mit den aktuellen Play-Richtlinien rechtlich geprüft werden.

## 3. Datenmodell (Anforderungen an den Supabase-Agenten)

Die Migrationen erstellt der Supabase-Agent. Dieses Dokument nennt nur die Felder.

| Tabelle | Zweck | Wichtige Felder |
| --- | --- | --- |
| `billing_customers` | Zuordnung Nutzer oder Organisation zu Stripe-Kunde | owner_type (`user`/`organization`), owner_id, stripe_customer_id, created_at |
| `subscriptions` | Abo-Status aus Stripe oder Google Play | id, owner_type, owner_id, provider (`stripe`/`google_play`), provider_subscription_id, plan_code, status, current_period_end, cancel_at_period_end |
| `invoices` | Rechnungsinformationen (Referenz, keine Steuerlogik) | id, subscription_id, provider_invoice_id, amount, currency, status, issued_at |
| `billing_events` | Verarbeitete Webhook-Events (Idempotenz) | provider, event_id (unique), type, received_at, processed_at |
| `entitlements` | Abgeleitete Rechte je Nutzer oder Organisation | owner_type, owner_id, feature_code, granted, source_subscription_id, valid_until |

Regeln:

- `billing_events.event_id` ist eindeutig. Ein doppeltes Event wird ignoriert.
- `entitlements` wird nur serverseitig aus `subscriptions` abgeleitet, nie direkt vom Client geschrieben.
- Zahlungsdaten (Kartennummern) werden nie gespeichert. Nur IDs und Status.
- RLS: Nutzer lesen nur eigene Zeilen. Schreiben nur der Service-Role auf dem Server.

## 4. Stripe-Integration

- **Checkout Session** für neue Abos, Erfolgsseite liest den Status serverseitig nach.
- **Customer Portal** für Planwechsel, Kündigung und Zahlungsmethode.
- **Webhooks** (Ziel-Endpunkt auf dem Server): `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid`, `invoice.payment_failed`.
- Signaturprüfung mit `stripe.webhooks.constructEvent` und dem Webhook-Secret, bevor Daten verarbeitet werden.
- Stripe-Status wird in `subscriptions` gespiegelt, `entitlements` daraus abgeleitet.

## 5. Abo-Lebenszyklus

| Status | Bedeutung | Entitlement |
| --- | --- | --- |
| `incomplete` | Zahlung läuft noch | nein |
| `active` | Aktiv | ja |
| `past_due` | Zahlung fehlgeschlagen, Schonfrist | ja, bis `current_period_end` |
| `canceled` | Gekündigt, Laufzeit vorbei | nein |
| `cancel_at_period_end` | Gekündigt zum Laufzeitende | ja, bis Laufzeitende |

Kündigung ist jederzeit im Customer Portal möglich. Eine Rückerstattung oder Kulanzregel ist eine offene Geschäftsentscheidung.

## 6. Preismodell (Platzhalter)

Die Preise werden später festgelegt. Im Code stehen nur Plan-Codes, keine Beträge.

- B2C: `free`, `premium_monthly`, `premium_yearly`
- B2B: `business_starter`, `business_professional`, `business_enterprise`
- Beträge kommen aus Stripe-Preisen (`price_id`) über Umgebungsvariablen, nicht fest im Code.

## 7. Google Play Billing (Android, später)

- Produkte als Abo-Produkte in der Play Console anlegen (Produkt-IDs entsprechen den `plan_code`-Werten).
- Die App kauft über Google Play Billing. Der Kauf-Token geht an den Server.
- Der Server prüft den Token bei Google (Play Developer API) und schreibt `subscriptions` mit `provider = google_play`.
- Google-Play-Webhooks (Real-time Developer Notifications über Pub/Sub) aktualisieren den Status.
- Das Entitlement ist für Web und App dasselbe, sofern der Nutzer dasselbe Konto verwendet.
- Ob Web-Käufe auch in der App sichtbar sein dürfen, ist vor Umsetzung gegen die Play-Richtlinien zu prüfen.

## 8. Testmodus und Freigabe

1. Stripe Test Mode mit Testkarten, ohne echte Zahlung.
2. Webhook-Tests mit der Stripe CLI (lokal) und Signaturprüfung.
3. Idempotenz-Test: dasselbe Event zweimal senden, nur ein Effekt.
4. Playwright-Tests für Checkout-Erfolg und Portal-Link im Testmodus.
5. Live-Modus erst nach ausdrücklicher Freigabe und rechtlicher Prüfung (AGB, Widerruf, Preisangaben).

## 9. Offene Punkte

- Rechtliche Prüfung der Play-Richtlinie für MOVORA-Premium.
- Preise und Planumfang festlegen.
- Umgang mit Rechnungen (Stripe Invoices oder eigenes Format).
- Kulanz- und Rückerstattungsregeln.
- Umsatzsteuer (Stripe Tax ja oder nein).
