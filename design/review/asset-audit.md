# Abgleich der Bediengrafiken

Stand: 17.09.2026

Verglichen wurden `design/overview/component-library.png`, die gespeicherten Designansichten und die aktuell verwendeten Symbole in `public/assets/icons.svg`.

| Bereich | Ergebnis |
| --- | --- |
| Kartenmotive | Die vom Nutzer bestätigten Karten-Komponenten sind vollständig eingebunden. |
| Kartenrückseiten | Laptop-Symbol, Farben, Form und Schatten entsprechen den vier Darstellungen der Komponentenübersicht. Die Rückseiten werden absichtlich aus einem gemeinsamen Symbol und Theme-Farben aufgebaut. |
| Exit- und Start-Icon | Form und Verwendung stimmen mit der Komponentenübersicht überein. |
| Settings-Icons | Palette, Spielfeldgröße und Layout stimmen visuell mit der Vorlage überein. |
| Spieler-Icon | Gaming, DA Projects und Food verwenden in der Vorlage eine Spielfigur. Code Vibes verwendet dort ein anderes, kantiges Symbol. Der aktuelle Code verwendet für alle Themes dieselbe Spielfigur. |
| Home-Controller | Position und sichtbarer Ausschnitt stimmen weitgehend mit der gespeicherten Home-Ansicht überein. Das aktuelle Symbol ist eine eigene SVG-Kontur; ein separater Originalexport liegt nicht im Projekt. |

## Noch benötigte Originalexporte

- das Spieler- beziehungsweise Punktesymbol für Code Vibes
- der große Controller des Homescreens, falls eine pixelgenaue Übereinstimmung verlangt wird

Die beiden fehlenden Originale werden nicht aus Screenshots ausgeschnitten. Dafür werden die Einzeldateien aus der Designquelle benötigt.

## Hover-Verhalten

Die Komponentenübersicht beschreibt ausdrücklich das Game-Theme-Element als interaktiv: Die Vorschau ändert sich beim Darüberfahren, die Auswahl erst beim Anklicken. Für Spieler, Spielfeldgröße und Layout zeigt die Vorlage nur Auswahlzustände und keine zusätzliche Hover-Vorschau. Deshalb bleibt die Vorschau auf die Theme-Auswahl begrenzt.
