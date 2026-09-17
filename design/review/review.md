# Designvergleich vom 14.09.2026

Die Spielabläufe sind getestet und die am 14.09.2026 dokumentierten Hauptabweichungen wurden behoben. Die Abschlusskontrolle erfolgte mit echten Chrome-Screenshots bei 1440 × 1024. Die finalen Screenshots zeigen DA Projects, Light, 4×4 und einen Sieg von Blue; die Theme-Regeln für Code Vibes, Gaming und Food wurden ebenfalls an ihre Vorlagen angepasst.

| Ansicht | Beobachtete Abweichung | Vergleich |
| --- | --- | --- |
| Homescreen | Lokale Display-Schrift, Abstände, Play-Button und sichtbarer Controller-Ausschnitt angeglichen. | [Final](final-home.png), [Vorlage](../screens/home/home.jpg) |
| Settings | Optionen untereinander; Unterstreichung, Gruppenicons, Auswahlmarkierung, kompakte Startleiste und Wellenbild ergänzt. | [Final](final-settings.png), [Vorlage](../screens/settings/settings-da-projects.jpg) |
| DA-Projects-Spielfeld | Weißer Hintergrund, kompaktere Karten, größere Statusanzeige und die vorgesehenen Laptop- und Spielericons umgesetzt. | [Final](final-game.png), [Vorlage](../screens/game/da-projects/board-16.jpg) |
| Ergebnis | Auf Wunsch wieder als weißes Dialogfenster mit Konfetti, Punkteständen und den bisherigen Aktionen umgesetzt. | [Vorheriger Stand](current-result.png) |

## Theme-Gestaltung

- Code Vibes: dunkler neutraler Hintergrund und türkisfarbener Kartenverlauf.
- Gaming: technische Orbitron-Schrift, Spielericons und pink umrandeter Exit-Button.
- Food: Klee-One-Schrift, orangefarbene Rückseiten und beige Statusleiste.
- Alle vier Themes verwenden jetzt die vorhandenen Bilddateien. Vorschau und Spielfeld lesen ihre Motive aus derselben Datenquelle; Emojis werden nicht mehr als Ersatzmotive verwendet.

## Überarbeitung nach dem Mentorfeedback vom 15.09.2026

- Der Controller-Ausschnitt zeigt Steuerkreuz und Tasten vollständig genug innerhalb der sichtbaren Fläche.
- Der Settings-Header steht vor dem zentralen `main`-Element.
- Die Vorschau reagiert beim Hover und Tastaturfokus auf Game Themes, ohne das ausgewählte Radio-Feld zu ändern.
- Die Startleiste zeigt die vier gewählten Werte und bleibt durch reservierte Breiten stabil.
- Vorschau und Startleiste besitzen entsprechend der Vorlage unterschiedliche Breiten.
- Der neue Exit-Dialog bietet die Aktionen `No, back to game` und `Exit game`; bestätigter Exit führt zurück zu den Settings.
- Vergleichsbilder liegen unter `mentor-home.png`, `mentor-settings.png`, `mentor-hover-gaming.png` und `mentor-exit.png`.

Die Herkunft der im Repository vorhandenen Karten- und Bedienicons lässt sich aus dem Repository allein nicht sicher bestätigen. Für einen belastbaren Nachweis als Originalexporte wird die externe Designquelle benötigt.

## Umgesetzte Korrekturen

1. Lokale Schriften eingebunden und Homescreen, Play-Button und Controller an die Referenz angenähert.
2. Settings einspaltig angeordnet; Titelunterstreichung, Gruppenicons, Auswahlmarkierungen und echtes DA-Vorschaubild ergänzt.
3. Spielfeld verkleinert; Kartenradius vererbt und Laptop-, Spieler- sowie Exit-Symbole eingesetzt.
4. Theme-Farben und Schriften differenziert; die Ergebnisansicht wurde anschließend auf Wunsch wieder auf das Dialogfenster mit Konfetti zurückgesetzt.

Finale Kontrollbilder: [Homescreen](final-home.png), [Settings](final-settings.png), [Spielfeld](final-game.png). Für die zurückgesetzte Ergebnisansicht gilt wieder [dieser Stand](current-result.png).

Die geprüfte Light-/Dark-Auswahl muss erhalten bleiben. Die Vorlagen zeigen bei DA Projects selbst unterschiedliche Hintergründe für die Vorschau und das Spielfeld; eine Angleichung muss deshalb auch die Vorschau berücksichtigen, damit beide weiterhin dieselben gewählten Farben zeigen. Die bisherigen Farbtests belegen die Konsistenz der App, nicht die Übereinstimmung mit der Designvorlage.
