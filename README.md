# Memory

Ein responsives Memory-Spiel für zwei Personen. Vor einer Runde lassen sich Theme, Startspieler, Spielfeldgröße und helles oder dunkles Layout auswählen.

## Live-Demo

[christian-mulugeta.developerakademie.net](https://christian-mulugeta.developerakademie.net/)

## Funktionen

- vier Themes: Code Vibes, Gaming, DA Projects und Food
- Spielfelder mit 4 × 4, 4 × 6 oder 6 × 6 Karten
- zwei Spieler mit Punktestand und Anzeige des aktuellen Spielers
- Paarerkennung, Klicksperre während des Vergleichs und Spielerwechsel
- Ergebnisanzeige für Sieg oder Gleichstand sowie Neustart und Rückkehr zum Start
- Rückfrage vor dem Verlassen einer laufenden Runde und Rückkehr zu den Einstellungen
- Vorschau beim Darüberfahren über die Game Themes
- Tastaturbedienung, sichtbare Fokuszustände und responsive Darstellung

Eine anfängerfreundliche Erklärung der wichtigsten Typen und Abläufe steht in [`CODE-ERKLAERUNG.md`](CODE-ERKLAERUNG.md).

## Lokale Entwicklung

Voraussetzung ist eine aktuelle Node.js-Version.

```powershell
npm install
npm run dev
```

Vite zeigt anschließend die lokale Adresse im Terminal an. Die ursprüngliche `index.html` darf nicht direkt mit einer einfachen Live-Server-Erweiterung geöffnet werden, weil TypeScript und SCSS zuerst verarbeitet werden müssen.

## Tests und Build

```powershell
npm test
npm run build
```

Der Produktions-Build liegt danach in `dist/`. Die Vite-Konfiguration erzeugt relative Pfade, damit die Website auch in einem Unterordner eines Webservers funktioniert.

Für die Veröffentlichung wird der **Inhalt** von `dist/` in das Webverzeichnis geladen. `index.html`, `favicon.svg` und der Ordner `assets/` müssen dort auf derselben Ebene liegen.

## Technologien

- semantisches HTML
- SCSS
- TypeScript
- Vite
- Node.js Test Runner

## Projektstruktur

- `src/`: TypeScript-Typen, feste Spieldaten und Spiellogik
- `scss/`: Stylesheet der App
- `public/assets/cards/`: die 18 Karten-Komponenten jedes Themes
- `public/assets/fonts/`: lokale Schriftarten und ihre Lizenzen
- `design/`: Designvorlagen und dokumentierte Vergleichsbilder
- `tests/`: automatisierte Logik- und Browserprüfungen

## Optionale Erweiterungen

Über die Pflichtanforderungen hinaus enthält das Projekt vier Themes, drei Spielfeldgrößen, zwei Layouts, lokale Schriftarten, eine responsive Darstellung, reduzierte Animationen bei entsprechender Systemeinstellung, eine Ergebnisanzeige mit Konfetti sowie automatisierte Regressionstests für verzögerte Kartenvergleiche.
