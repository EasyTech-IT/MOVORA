# MOVORA – Android-App (technische Grundlage)

> **Status: Konzept.** Keine Veröffentlichung ohne Freigabe. Es werden keine Signierschlüssel erzeugt und keine Store-Einträge angelegt.

## 1. Empfehlung zur Architektur

**Keine gemeinsame Next.js-/Capacitor-Anwendung.** Die Android-App wird als eigenes Projekt mit Ionic React und Capacitor gebaut. Sie greift auf dasselbe Supabase-Backend zu.

Begründung:
- Next.js nutzt Server Components, Server Actions und Middleware. Diese laufen in einer Capacitor-WebView nicht.
- Der Export als statische Seite (`output: "export"`) würde die serverseitige Auth-Prüfung aus dem Web-Projekt entfernen. Das widerspricht der Fail-closed-Regel.
- Ein eigenes Projekt hält die Abhängigkeiten schlank und vermeidet Konflikte zwischen Next- und Capacitor-Tooling.

Trennung in einem Monorepo (empfohlen, falls später gewünscht):

```
apps/web        Next.js (bestehend)
apps/android    Ionic React + Capacitor (neu)
packages/shared Typen, Score-Anzeigelogik, Supabase-Typen, Konstanten
supabase/       Migrationen, RLS (gemeinsam)
```

Die Umstellung auf ein Monorepo ist eine eigene Entscheidung und nicht Teil dieses Schritts.

## 2. Wiederverwendbare Teile der Webplattform

| Teil | Wiederverwendung | Hinweis |
| --- | --- | --- |
| Supabase-Typen und Datenzugriff | ja, nach `packages/shared` | Browser-Client in der App neu aufsetzen |
| Score-Anzeigelogik und Konstanten | ja | Keine Scoring-Logik in der App berechnen |
| Demo-Daten (`lib/demo-data.ts`) | ja, als Vorlage | Markierung `isDemo` beibehalten |
| shadcn-Komponenten | nein | Ionic-Komponenten verwenden |
| Tailwind-Design-Tokens (Navy, Teal) | ja, als CSS-Variablen | Werte aus `app/globals.css` |
| Auth-Seiten, Proxy, `requireClaims` | nein | Serverseitig nicht übertragbar, App nutzt Supabase-Session mit sicherem Speicher |
| MapLibre-Komponente | teilweise | In der WebView testen, Offline-Kacheln prüfen |

## 3. Projektgrundlage (nach Freigabe)

- Ionic React mit Capacitor 7 oder aktuelle Version zum Zeitpunkt des Starts.
- Startvorlage: offizielle Capacitor-Starter (siehe [OPEN_SOURCE_COMPONENTS.md](./OPEN_SOURCE_COMPONENTS.md)). Nur Grundgerüst übernehmen.
- App-ID: `de.movora.app` (Vorschlag, Domain-Inhaber prüfen).
- Anzeigename: MOVORA.
- Mindest-Android-Version: API 24 (Android 7.0), Zielversion aktuelle Play-Vorgabe.

## 4. Mobile-Anforderungen

| Anforderung | Umsetzung |
| --- | --- |
| Android-Navigation | Ionic-Tabs, Zurück-Taste über Capacitor-Back-Button |
| Touch | Ziele mindestens 48 dp, Ionic-Gesten |
| Responsive | Ionic-Grid, Tests auf kleinen und großen Geräten |
| Sichere Session | Supabase-Session im Capacitor-Secure-Storage (kein `localStorage` für Tokens) |
| Kamera und Standort | Nur bei Bedarf anfragen, Begründung im Dialog, Ablehnung ohne Funktionsverlust |
| Push | Firebase Cloud Messaging über Capacitor-Plugin (Freigabe und Datenschutzprüfung nötig) |
| Offline | Nur für Anbieterprofile und Haltestellen-Stammdaten, nie für Scores ohne Zeitstempel |

## 5. Funktionen und Abhängigkeit vom Backend

| Funktion | Abhängigkeit | Status |
| --- | --- | --- |
| Login und Registrierung | Supabase Auth | nach Session-Test |
| Anbietersuche | Prompt 8, Schema | ausstehend |
| Kartenansicht | Geodaten (PostGIS) | ausstehend |
| Anbieterprofile | Prompt 8 | ausstehend |
| Bewertungen | RLS für Ratings | ausstehend |
| Favoriten | neue Tabelle mit RLS | ausstehend |
| Benachrichtigungen | Push-Konzept | ausstehend |
| Premium | Google Play Billing (siehe [PAYMENT_ARCHITECTURE.md](./PAYMENT_ARCHITECTURE.md)) | ausstehend |

## 6. Google Play: Vorbereitung

| Punkt | Stand |
| --- | --- |
| App-ID | Vorschlag `de.movora.app`, noch nicht reserviert |
| App-Icons | Adaptive Icon (Vordergrund plus Hintergrund in Navy), noch nicht erstellt |
| Splashscreen | Navy-Hintergrund, Wortmarke, Capacitor-Splash-Plugin |
| Build-Konfiguration | Gradle-Variante `debug` und `release`, Versionscode aus CI |
| Signing-Konzept | Play App Signing. Upload-Schlüssel nur lokal oder im Secret-Store, nie im Repository |
| Store-Metadaten | Titel, Kurzbeschreibung, Langbeschreibung, Datenschutzerklärung-URL, Kategorie Reisen und Lokales |
| Datensicherheitsformular | noch nicht ausgefüllt, abhängig von Datenerhebung |
| Digitale Käufe | Google Play Billing für Premium (Prüfung durch Rechtsberatung offen) |

## 7. Umsetzungsreihenfolge (nach Freigabe)

1. Projekt-Gerüst mit Ionic, Capacitor und Android-Plattform, lauffähig im Emulator.
2. Login mit Supabase und sicherem Session-Speicher.
3. Tab-Navigation und Anbietersuche (mit Demo-Daten).
4. Kartenansicht und Anbieterprofile.
5. Bewertungen, Favoriten, Benachrichtigungen.
6. Offline-Cache, Premium-Anbindung über Play Billing.
7. Store-Vorbereitung und erster interner Testlauf.

## 8. Offene Punkte für Ihre Freigabe

- Projekt getrennt (empfohlen) oder Monorepo.
- Reservierung der App-ID `de.movora.app` und Domain-Prüfung.
- Firebase für Push: Zustimmung und Datenschutzfolgenabschätzung.
- Mindest-Android-Version (API 24 vorgeschlagen).
- Rechtliche Prüfung Play Billing für Premium.
