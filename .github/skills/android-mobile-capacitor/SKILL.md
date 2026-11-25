---
name: android-mobile-capacitor
description: Android-App für MOVORA mit Ionic React und Capacitor: Grundgerüst, native Berechtigungen, Build-Trennung und Store-Vorbereitung. Verwenden, sobald die Web-Grundlage stabil ist.
---

# Android und mobile App (Capacitor)

## Wann einsetzen
- Einrichtung oder Änderung des Capacitor-Projekts.
- Native Funktionen wie Standort, Kamera oder Benachrichtigungen.
- Android-Build, Signierung oder Veröffentlichung.

## Zuerst lesen
1. [docs/OPEN_SOURCE_COMPONENTS.md](../../../docs/OPEN_SOURCE_COMPONENTS.md) (Abschnitt Ionic Capacitor Starters).
2. Offizielle Capacitor-Dokumentation zu Android und Berechtigungen.

## Fachliche Regeln
- Die Web-App bleibt die Grundlage. Die App lädt dieselben Oberflächen und Schnittstellen, nicht eine zweite Codebasis.
- Ionic React nur für die mobile Shell verwenden, wenn eine Oberfläche es verlangt. Keine doppelten UI-Bibliotheken.
- Berechtigungen nur anfordern, wenn die Funktion sie braucht, mit verständlicher Begründung.
- Entwicklungs- und Produktionskonfiguration trennen (Server-URL, Bundle-ID).

## Arbeitsablauf
1. Offizielle Capacitor-Vorlage prüfen und Lizenz (MIT) in [docs/OPEN_SOURCE_COMPONENTS.md](../../../docs/OPEN_SOURCE_COMPONENTS.md) eintragen.
2. Capacitor-Projekt anlegen, ohne die bestehende Web-App zu überschreiben.
3. Berechtigungen im Android-Manifest minimal setzen.
4. Debug-Build lokal erstellen. Release-Build nur nach Freigabe.

## Sicherheitsregeln
- Keystores, Passwörter und Signierschlüssel nie ins Repository. Sie liegen lokal oder im Secret-Store.
- Keine Tokens im Quellcode oder in der Konfiguration, die gebaut wird.
- Kein Tracking und keine Werbe-IDs ohne Einwilligung.
- Veröffentlichung im Play Store nur nach ausdrücklicher Freigabe.

## Typische Fehler
- Web-Build und Capacitor-Build laufen auseinander, weil eine Umgebungsvariable fehlt.
- Berechtigungen werden vergessen oder zu weit gefasst.
- Keystore wird versehentlich committet.

## Qualitätskontrolle
- `npm run build` bleibt grün.
- Android-Build lokal prüfen, wenn das Android-SDK verfügbar ist. Sonst als nicht geprüft melden.

## Definition of Done
- Web-Build grün, Berechtigungen begründet, keine Secrets im Repository, Store-Schritte nur mit Freigabe.
