---
name: stripe-and-subscriptions
description: Stripe Checkout, Customer Portal, Abonnements, Webhooks und Entitlements für MOVORA, getrennt von Google-Play-Abos. Verwenden bei allen Zahlungs- und Abo-Funktionen.
---

# Stripe und Abonnements

## Wann einsetzen
- Checkout, Kundenportal, Abo-Status oder Rechnungen.
- Webhook-Verarbeitung.
- Freischaltung von Funktionen je nach Abo (Entitlements).

## Zuerst lesen
1. [docs/OPEN_SOURCE_COMPONENTS.md](../../../docs/OPEN_SOURCE_COMPONENTS.md) (Abschnitt Next.js SaaS Starter). Der Starter nutzt Drizzle und PostgreSQL und ist nicht direkt kompatibel. Nur Konzepte übernehmen.
2. Stripe-Dokumentation zu Checkout, Customer Portal und Webhooks.

## Fachliche Regeln
- Stripe-Webzahlungen und Google-Play-Abonnements sind getrennte Vorgänge mit eigener Quelle. Entitlements führen beide Quellen zusammen, nicht vermischen.
- Der Abo-Status wird nur aus verifizierten Webhook-Events oder der Stripe-API gesetzt, nie aus dem Client.
- Webhook-Signatur immer prüfen (`stripe.webhooks.constructEvent`).
- Idempotent verarbeiten. Dasselbe Event kann mehrfach kommen.
- Preise und Produkt-IDs in Stripe, nicht hartkodiert.
- Testdaten im Stripe-Testmodus. Live-Modus nur nach Freigabe des Nutzers.

## Arbeitsablauf
1. Produkt und Preis in Stripe (Testmodus) anlegen.
2. Checkout-Route auf dem Server erstellen, Nutzer-ID mitgeben.
3. Webhook-Route mit Signaturprüfung und Idempotenz.
4. Entitlements in Supabase speichern (über Migration, siehe Skill `supabase-database-engineering`).
5. Tests mit Stripe-CLI oder Testkarten.

## Bibliotheken und Werkzeuge
`stripe` (Node), Stripe CLI, Supabase.

## Sicherheitsregeln
- `STRIPE_SECRET_KEY` und `STRIPE_WEBHOOK_SECRET` nur als Umgebungsvariablen, nie im Code oder im Client.
- Keine Kartendaten speichern. Stripe übernimmt die Zahlung.
- Preisangaben immer serverseitig aus Stripe lesen.

## Typische Fehler
- Freischaltung direkt nach Redirect vom Checkout, ohne Webhook-Bestätigung.
- Webhook ohne Signaturprüfung.
- Doppelte Verarbeitung desselben Events.
- Google-Play- und Stripe-Abos im selben Feld vermischt.

## Qualitätskontrolle
- Testlauf mit Stripe-Testkarten und Webhook-Replay.
- Abbruch, Fehler und Kündigung getestet.

## Definition of Done
- Checkout, Webhook und Portal funktionieren im Testmodus.
- Entitlements sind serverseitig geprüft.
- Keine Secrets im Code, Live-Freigabe ausstehend dokumentiert.
