# MOVORA – Row Level Security (Konzept)

Status: **Entwurf zur Prüfung.** Dieses Dokument legt fest, welche Policies nötig sind. Die SQL-Umsetzung erfolgt erst als Migration durch den Supabase-Agenten, nach Freigabe des [Datenbankmodells](./DATABASE_MODEL.md).

## 1. Grundregeln

- RLS ist auf **jeder** Tabelle im Schema `public` aktiviert. Eine Tabelle ohne RLS gilt als Fehler.
- Standardmäßig gilt „kein Zugriff“. Jede Policy erlaubt gezielt.
- Der `service_role`-Schlüssel wird nie im Browser oder in Client-Code verwendet. Er ist nur für serverseitige Importe und Scoring-Jobs vorgesehen und bleibt in Umgebungsvariablen ohne `NEXT_PUBLIC_`-Präfix.
- Policies nutzen `auth.uid()` und die Rollen aus `user_roles`. Keine Rechte aus Client-Parametern ableiten.
- Schreibrechte für Scores und Snapshots bestehen nur serverseitig.

## 2. Policy-Matrix (Entwurf)

| Tabelle | anonymous | user | organization_member | admin | Hinweis |
| --- | --- | --- | --- | --- | --- |
| `transport_modes` | SELECT | SELECT | SELECT | ALL | Stammdaten |
| `organizations` | SELECT (öffentliche Felder) | SELECT | SELECT eigene | ALL | Keine internen Felder öffentlich |
| `lines` | SELECT | SELECT | SELECT, INSERT/UPDATE eigene Organisation | ALL | Schreiben nur für die eigene Organisation |
| `stops` | SELECT | SELECT | SELECT | ALL | Schreiben nur über Import |
| `stop_lines` | SELECT | SELECT | SELECT, schreiben eigene Linien | ALL | |
| `trips`, `trip_stops` | SELECT | SELECT | SELECT, schreiben eigene Linien | ALL | |
| `data_sources` | SELECT (ohne interne Felder) | SELECT | SELECT | ALL | Keine Zugangsdaten in Spalten |
| `profiles` | – | SELECT/UPDATE eigene Zeile | SELECT/UPDATE eigene Zeile | SELECT | Keine fremden Profile |
| `user_roles` | – | SELECT eigene Zeilen | SELECT eigene Zeilen | ALL | Rollen nur durch Admin ändern |
| `ratings` | SELECT aggregiert über View | INSERT/UPDATE/SELECT eigene | keine Bewertung eigener Linien | SELECT, Moderation | Rohdaten nie öffentlich |
| `score_snapshots` | SELECT, nur wenn Mindeststichprobe erreicht | SELECT | SELECT | SELECT | Schreiben nur serverseitig |

Legende: SELECT/INSERT/UPDATE/DELETE. „–“ bedeutet kein Zugriff.

## 3. Umsetzungsregeln

- **Öffentliche Sichten:** Für `ratings` und `organizations` werden Views mit Spaltenauswahl verwendet, die nur freigegebene Felder enthalten. Die Views werden nicht mit `security definer` erstellt, außer es wird geprüft und dokumentiert.
- **Rekursionsfreie Policies:** Rollenprüfungen laufen über eine Funktion mit `security definer` und festem `search_path`, die nur `user_roles` liest.
- **Bewertungen:** Ein Nutzer kann nur Zeilen mit eigenem `reviewer_key` schreiben. Der Schlüssel wird serverseitig abgeleitet, nicht vom Client gesendet.
- **Anbieter-Ausschluss:** Ein Mitglied einer Organisation darf keine Bewertung für Linien dieser Organisation abgeben. Die Prüfung läuft über eine Funktion und setzt die Tabelle `organization_members` voraus (offen, siehe Datenmodell).
- **Mindeststichprobe:** Die Policy für anonyme Scores liefert nur Zeilen, deren `sample_size` den Schwellwert erreicht.

## 4. Tests

Die RLS-Tests laufen mit getrennten Testkonten und ausschließlich im Supabase-Testprojekt, nie in Produktion.

Mindestens zu prüfen:

1. Anonymer Zugriff auf `ratings` und `profiles` wird verweigert.
2. Nutzer A kann Bewertungen von Nutzer B weder lesen noch ändern.
3. Nutzer kann die eigene Rolle nicht selbst erhöhen (`user_roles`).
4. Organisation A kann Linien von Organisation B nicht ändern.
5. Anbieter kann keine Bewertung für eigene Linien abgeben.
6. Scores unter der Mindeststichprobe erscheinen nicht für anonyme Nutzer.
7. Ohne Session liefert `service_role`-freier Client keine geschützten Zeilen.

Die Tests werden als SQL-Tests oder über die Supabase-Client-API mit Testkonten geschrieben. Sie sind Teil der Migrationsabnahme.

## 5. Offene Punkte

1. Freigabe des Datenmodells und der Policy-Matrix durch den Nutzer.
2. Entwurf von `organization_members` und der Rolle `organization_member`.
3. Festlegung der öffentlichen Felder für `organizations` und `data_sources`.
4. Entscheidung, ob Sichten oder Funktionen für Scores verwendet werden.
5. Aufbau des Testprojekts und der Testkonten, siehe [SUPABASE_SETUP.md](./SUPABASE_SETUP.md).
