---
description: Ergänzt eine GTFS- oder GBFS-Datenquelle für MOVORA, mit Lizenzprüfung und Validierung.
---

Ergänze die Datenquelle `${input:quelle:Name und URL der Datenquelle}`.

Vorgehen nach dem Skill [mobility-data-engineering](../skills/mobility-data-engineering/SKILL.md) und [open-source-integration](../skills/open-source-integration/SKILL.md):

1. Lizenz und Nutzungsbedingungen der Quelle prüfen und dokumentieren.
2. Feed mit dem GTFS Validator prüfen. Fehler und Warnungen zusammenfassen.
3. Import nur mit Validierung und Fehlerprotokoll.
4. Eintrag in [docs/OPEN_SOURCE_COMPONENTS.md](../../docs/OPEN_SOURCE_COMPONENTS.md) ergänzen.
