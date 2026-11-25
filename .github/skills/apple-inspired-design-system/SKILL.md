---
name: apple-inspired-design-system
description: Eigenständiges, Apple-inspiriertes Designsystem für MOVORA mit navy/teal-Palette, klarer Typografie, Karten und Komponenten auf shadcn/ui-Basis. Verwenden bei allen UI-Entscheidungen.
---

# Apple-inspiriertes MOVORA-Designsystem

## Wann einsetzen
- Neue Seite, Komponente oder Layout.
- Änderung an Farben, Typografie, Abständen, Radien oder Schatten.
- Review einer bestehenden Oberfläche auf Konsistenz.

## Zuerst lesen
1. [app/globals.css](../../../app/globals.css) (Design-Tokens).
2. [components.json](../../../components.json) und `components/ui/` (shadcn-Basis).
3. [tailwind.config.ts](../../../tailwind.config.ts).

## Fachliche Regeln
- Haupt-Palette: Navy, Teal, Weiß. Neutrale Grautöne für Flächen und Text.
- Ruhige Flächen, großzügige Abstände, klare Hierarchie. Pro Bildschirm ein Hauptgedanke.
- Abgerundete Karten mit dezenten Schatten. Glassmorphism nur an einzelnen, bewusst gewählten Stellen.
- Keine Emoji als Icons. Icons aus einer einzigen Icon-Bibliothek (lucide, bereits über shadcn verfügbar).
- Eigene Gestaltung. Apples Oberfläche wird nicht kopiert (keine Nachbildung von SF-Layouts, Logos oder Markenelementen).
- Farben, Radien und Schatten nur als Design-Tokens, nie als Einzelwerte in Komponenten.
- Kontrast mindestens WCAG AA.

## Arbeitsablauf
1. Vorhandene Tokens und shadcn-Komponenten prüfen.
2. Neue Werte zuerst als Token definieren.
3. Komponenten aus `components/ui/` verwenden, nicht neu erfinden.
4. Light- und Dark-Modus, Mobil und Desktop prüfen.
5. Kontrast und Fokuszustände prüfen.

## Bibliotheken und Werkzeuge
Tailwind CSS, shadcn/ui, Radix-basierte Primitives, lucide-react, next-themes.

## Sicherheitsregeln
Nicht zutreffend, aber: keine externen Schriften oder Assets ohne Lizenzprüfung einbinden.

## Typische Fehler
- Hardcodierte Hex-Farben in Komponenten.
- Emoji als Icon-Ersatz.
- Zu viele Schatten, Verläufe und Transparenzen gleichzeitig.
- Eigene Button- oder Dialog-Implementierung neben shadcn.

## Qualitätskontrolle
- Keine hartkodierten Farben außerhalb der Tokens.
- Kontrastwerte geprüft. Fokus sichtbar.
- Seite ohne Animation vollständig nutzbar.

## Definition of Done
- Tokens und Komponenten konsistent verwendet.
- Light, Dark, Mobil und Desktop geprüft.
- Abweichungen vom Designsystem dokumentiert.
