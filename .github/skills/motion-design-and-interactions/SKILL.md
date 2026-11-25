---
name: motion-design-and-interactions
description: Dezente Motion und Interaktionen für MOVORA mit Hover-, Dialog-, Skeleton- und Diagramm-Animationen, inklusive Reduced Motion. Verwenden bei jeder Animation oder Übergang.
---

# Motion Design und Interaktionen

## Wann einsetzen
- Hover, Klick, Menü-, Dialog- oder Seitenübergang.
- Ladezustände (Skeleton), animierte Diagramme oder Kennzahlen.
- Kartenmarker- und Favoriten-Feedback.

## Zuerst lesen
1. [app/globals.css](../../../app/globals.css) (vorhandene Keyframes und Tailwind-Animationen).
2. `components/ui/` (Dialog, Dropdown und Tabs haben bereits Übergänge).
3. [docs/OPEN_SOURCE_COMPONENTS.md](../../../docs/OPEN_SOURCE_COMPONENTS.md) zur Motion-Entscheidung.

## Fachliche Regeln
- Zuerst CSS und vorhandene shadcn-Übergänge nutzen. Motion (motion.dev) nur, wenn diese nicht reichen. Installation nur nach Begründung.
- Animationen nur für Rückmeldung oder Orientierung, nie als Selbstzweck.
- Dauer meist 150 bis 300 ms, Ease-out für Eintritt.
- Nur `transform` und `opacity` animieren (Performance).
- Keine Dauerschleifen, außer Ladeindikatoren.
- `prefers-reduced-motion` respektieren: Animationen reduzieren oder entfernen.
- Die Oberfläche muss ohne Animation vollständig nutzbar sein.

## Arbeitsablauf
1. Interaktion und Zweck benennen (Rückmeldung, Orientierung, Ladezustand).
2. CSS-Lösung wählen. Prüfen, ob shadcn sie bereits liefert.
3. Dauer und Easing als Token festlegen.
4. Reduced-Motion-Variante prüfen.
5. Auf Mobilgeräten und mit langsamer CPU testen.

## Bibliotheken und Werkzeuge
Tailwind CSS (`tailwindcss-animate`), CSS-Transitions, optional Motion für React.

## Sicherheitsregeln
Nicht zutreffend. Keine externen Animations-Bibliotheken ohne Lizenzprüfung.

## Typische Fehler
- Layout-Eigenschaften (width, top) animiert, dadurch Ruckeln.
- Endlos laufende Effekte auf Karten.
- Reduced Motion ignoriert.
- Motion installiert, obwohl CSS gereicht hätte.

## Qualitätskontrolle
- Reduced Motion geprüft.
- Animation auf mobilem Gerät flüssig.
- Keine Dauerschleife ohne Ladezustand.

## Definition of Done
- Animation dient einem klaren Zweck und ist dokumentiert.
- Reduced Motion berücksichtigt.
- Seite funktioniert ohne Animation.
