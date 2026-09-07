# Lern- und Projektplan: Memory

Letzte Aktualisierung: 07.09.2026

## Status

- `[x]` erledigt
- `[ ]` offen
- `AKTUELL` nächster gemeinsamer Lernschritt

## Arbeitsweise

- Wir bearbeiten immer nur einen kleinen Schritt gleichzeitig.
- Vor einem neuen TypeScript- oder SCSS-Konzept klären wir: Was? Warum? Wie? Unterschied zu JavaScript/CSS?
- Du bekommst zuerst eine kleine Frage oder Aufgabe und schreibst möglichst selbst.
- Bei Fehlern gibt es zuerst einen Hinweis, danach bei Bedarf eine schrittweise Erklärung.
- Nach jedem größeren Abschnitt folgt eine kurze Lernwiederholung.
- Diese Datei wird nach jedem abgeschlossenen Schritt aktualisiert.

## Projektziel aus der Checkliste

Eine Memory-App mit vier sichtbaren Zuständen:

1. Homescreen
2. Settings
3. Spielfeld
4. Spielende-Anzeige

Die App bietet zwei Spieler, drei Spielfeldgrößen, mindestens zwei Themes und mindestens zwei auswählbare Layouts. Sie zeigt den aktuellen Spieler und die Punktestände, animiert das Umdrehen der Karten, erkennt Paare und bestimmt am Ende den Gewinner.

## Abhängigkeiten in Kurzform

`Anforderungen -> Werkzeugbasis -> HTML-Grundgerüst -> SCSS-Basis -> Einstellungen und Typen -> Kartendeck -> Spielzüge -> Spielende -> Qualitätsprüfung`

---

## 0. Überblick und vorhandenen Stand verstehen

Ziel: Wir wissen, was gefordert ist und womit wir starten.

- [x] Komplette zweiseitige PDF-Checkliste gelesen.
- [x] Vorhandene Dateien geprüft: `index.html`, `src/main.ts`, `scss/main.scss`, `package.json`, `tsconfig.json`.
- [x] Vorhandenen Stand festgehalten: Vite, TypeScript und Sass sind angelegt; HTML und TypeScript enthalten bisher nur einen kleinen Test; die SCSS-Datei ist leer.
- [x] Eigenständiges lokales Git-Repository vorbereitet und mit dem GitHub-Repository `Memory` verknüpft.
- [x] 62 Bilder endgültig geordnet: Designreferenzen liegen außerhalb des Builds unter `design`; verwendbare Grafiken liegen unter `public/assets` und besitzen verständliche Dateinamen.
- [x] Den Ablauf der App festlegen: `Homescreen -> Settings -> Spielfeld -> Spielende-Anzeige`; „Exit Game“ führt zurück zum Homescreen.
- [ ] `AKTUELL` Begriffe aus der Checkliste klären: Was unterscheidet in diesem Projekt ein **Theme** von einem **Layout**?
- [x] Design-Screens nach Ansicht, Theme, Ergebnis und Spielfeldgröße sortiert; DA-Projects-Kartenmotive und Effekte getrennt abgelegt.
- [ ] Die zwei verlinkten Coding-Konventionen gemeinsam lesen, sobald Zugriff auf die Google-Dokumente besteht.

### Lernkontrolle 0

- [ ] Ich kann die vier App-Zustände und ihre Übergänge erklären.
- [ ] Ich kann alle Pflichtfunktionen nennen.
- [ ] Ich kann Theme und Layout für dieses Projekt eindeutig beschreiben.

---

## 1. Entwicklungsumgebung und Einstiegspunkt verstehen

Voraussetzung: Abschnitt 0 ist geklärt.

Ziel: TypeScript und SCSS werden zuverlässig geprüft beziehungsweise verarbeitet.

- [ ] Verstehen, welche Aufgabe Vite, TypeScript und Sass jeweils haben.
- [ ] Den Unterschied zwischen TypeScript-Quellcode und dem JavaScript erklären, das der Browser ausführt.
- [ ] Den Unterschied zwischen SCSS-Quellcode und dem CSS erklären, das der Browser versteht.
- [ ] `package.json` und `tsconfig.json` gemeinsam Zeile für Zeile auf die für uns wichtigen Einstellungen prüfen.
- [ ] Build-Skript kontrollieren und nur nötige Korrekturen vornehmen.
- [ ] SCSS-Einstiegspunkt mit der App verbinden.
- [ ] Einen unveränderten Entwicklungsstart und Produktions-Build erfolgreich testen.
- [ ] Eine einfache, anfängerfreundliche Ordnerstruktur festlegen; erst aufteilen, wenn mehrere Dateien wirklich helfen.

### Lernkontrolle 1

- [ ] Ich kann erklären, warum der Browser TypeScript und SCSS nicht direkt ausführt.
- [ ] Ich weiß, wo der Einstiegspunkt der App liegt.
- [ ] Ich kann Entwicklungsserver, Typprüfung und Build unterscheiden.

---

## 2. Semantisches HTML-Grundgerüst erstellen

Voraussetzung: Abschnitt 1 funktioniert.

Ziel: Alle App-Zustände besitzen eine saubere, noch weitgehend ungestylte HTML-Grundlage.

- [ ] Sprache, Seitentitel und grundlegende Metadaten sinnvoll setzen.
- [ ] Einen zentralen App-Container anlegen.
- [ ] Homescreen mit Überschrift und Start-Button strukturieren.
- [ ] Settings-Bereich mit echten Formular-Elementen strukturieren.
- [ ] Spielbereich mit Statuszeile, Spielfeld und „Exit Game“-Button strukturieren.
- [ ] Spielende-Anzeige mit Ergebnis und „Neue Runde“-Button strukturieren.
- [ ] Sinnvolle HTML-Elemente, Beschriftungen und Button-Typen prüfen.

### Lernkontrolle 2

- [ ] Ich kann erklären, warum semantisches HTML für Lesbarkeit und Barrierefreiheit wichtig ist.
- [ ] Ich weiß, welche Inhalte dauerhaft vorhanden sind und welche die App später ein- oder ausblendet.

---

## 3. SCSS-Grundlagen und gemeinsames Designsystem

Voraussetzung: Abschnitt 2 enthält die benötigte Struktur.

Ziel: Wir bauen auf bekannten CSS-Regeln auf und nutzen zunächst nur hilfreiche SCSS-Funktionen.

- [ ] SCSS-Syntax mit normalem CSS vergleichen.
- [ ] Kleine Farb-, Abstands- und Größenvariablen anlegen.
- [ ] Verschachtelung an einem kleinen Element üben und zu tiefe Verschachtelung vermeiden.
- [ ] Den Elternselektor `&` an einem Button-Zustand verstehen.
- [ ] Basisstile für `body`, Buttons und Formulare erstellen.
- [ ] Wiederkehrende Komponenten erst bei echtem Bedarf in SCSS-Partials aufteilen.
- [ ] Fokuszustände, Lesbarkeit und einfache Responsivität berücksichtigen.

### Lernkontrolle 3

- [ ] Ich kann SCSS-Variablen, Verschachtelung und `&` erklären.
- [ ] Ich erkenne, wann normales CSS einfacher bleibt.
- [ ] Ich kann den Weg von `main.scss` zum Browser-CSS erklären.

---

## 4. User Story 1: Homescreen

Voraussetzung: HTML- und SCSS-Basis stehen.

Ziel: Eine optisch ansprechende Startseite führt zu den Settings.

- [ ] Homescreen entsprechend der verfügbaren Designvorgabe gestalten.
- [ ] Start-Button gut sichtbar und bedienbar gestalten.
- [ ] Controller-Icon korrekt positionieren.
- [ ] Controller-Icon mit einer einfachen, flüssigen CSS/SCSS-Animation versehen.
- [ ] In TypeScript den Start-Button sicher auswählen.
- [ ] Klick-Ereignis registrieren und vom Homescreen zu den Settings wechseln.
- [ ] DOM-Typen und den möglichen Wert `null` anfängerfreundlich behandeln.

### Abnahmepunkte aus der Checkliste

- [ ] Homescreen ist entsprechend der Vorgabe umgesetzt.
- [ ] Ein Button leitet zur Settings-Seite weiter.
- [ ] Controller-Icon ist passend positioniert und animiert.

### Lernkontrolle 4

- [ ] Ich kann Event Listener in JavaScript und TypeScript vergleichen.
- [ ] Ich kann erklären, warum `getElementById` möglicherweise `null` liefert.
- [ ] Ich verstehe die verwendete CSS-Keyframe-Animation.

---

## 5. User Stories 2 und 3: Settings und TypeScript-Datenmodell

Voraussetzung: Theme und Layout sind eindeutig definiert; Navigation zu den Settings funktioniert.

Ziel: Einstellungen werden verständlich erfasst und mit passenden TypeScript-Typen gespeichert.

- [ ] Zwei unterscheidbare Spielerfarben anbieten, zum Beispiel Blau und Orange.
- [ ] Genau drei Spielfeldgrößen anbieten: `4x4`, `4x6`, `6x6`.
- [ ] Mindestens zwei Themes anbieten; weitere Themes bleiben optional.
- [ ] Mindestens zwei Layouts anbieten.
- [ ] Festlegen und sichtbar machen, wie ein Layout das Farbschema verändert.
- [ ] Festlegen und sichtbar machen, wie die Auswahl die Motive der Memory-Bilder beeinflusst.
- [ ] Aus bekanntem JavaScript-Objekt schrittweise einen TypeScript-Typ für die Einstellungen entwickeln.
- [ ] Einfache Union Types für feste Auswahlwerte kennenlernen.
- [ ] Ein `interface` für zusammengehörige Spieleinstellungen kennenlernen.
- [ ] Formularwerte auslesen, prüfen und als typisierte Einstellungen speichern.
- [ ] Erst nach gültiger Auswahl das Spiel starten.

### Abnahmepunkte aus der Checkliste

- [ ] Auswahl zwischen zwei verschiedenen Spielern/Farben ist möglich.
- [ ] Auswahl zwischen `4x4`, `4x6` und `6x6` ist möglich.
- [ ] Mindestens zwei Themes können ausgewählt werden.
- [ ] Mindestens zwei Layouts können ausgewählt werden.
- [ ] Layout-Auswahl verändert das Farbschema.
- [ ] Auswahl beeinflusst die Themengebiete der Memory-Bilder.

### Lernkontrolle 5

- [ ] Ich kann `type`, Union Type und `interface` in einfachen Worten erklären.
- [ ] Ich kann erklären, welchen Fehler TypeScript bei ungültigen Auswahlwerten verhindert.
- [ ] Ich kann Formularwerte aus dem DOM typgerecht weiterverwenden.

---

## 6. Kartenmodell und Kartendeck vorbereiten

Voraussetzung: Die typisierten Settings stehen fest.

Ziel: Für jede Spielfeldgröße entsteht ein passendes, gemischtes Paar-Deck.

- [ ] Bestimmen, wie viele Paare jede Spielfeldgröße benötigt.
- [ ] Einen einfachen Typ beziehungsweise ein Interface für eine Memory-Karte entwickeln.
- [ ] Motive pro Theme als Daten ablegen.
- [ ] Aus Motiven Paare erzeugen.
- [ ] Die benötigte Kartenanzahl aus der gewählten Spielfeldgröße ableiten.
- [ ] Karten mit einer verständlichen Shuffle-Funktion mischen.
- [ ] Mit kleinen Beispieldaten prüfen, ob jede Karte genau einen Partner besitzt.

### Lernkontrolle 6

- [ ] Ich kann erklären, warum Karte, Motiv und Kartenpaar nicht dasselbe sind.
- [ ] Ich verstehe Arrays, `map`/Schleifen und Objektkopien im TypeScript-Kontext.
- [ ] Ich kann erklären, warum ein Deck vor dem Rendern erzeugt wird.

---

## 7. User Story 4: Spielfeld rendern und gestalten

Voraussetzung: Ein korrektes Kartendeck kann erzeugt werden.

Ziel: Das sichtbare Spielfeld entspricht allen gewählten Einstellungen.

- [ ] Karten aus den Daten ins DOM rendern.
- [ ] CSS Grid für `4x4`, `4x6` und `6x6` passend steuern.
- [ ] Gewähltes Farbschema anwenden.
- [ ] Gewählte Motive anzeigen.
- [ ] Oberhalb des Spielfelds beide Punktestände anzeigen.
- [ ] Aktuellen Spieler deutlich anzeigen.
- [ ] „Exit Game“-Button ergänzen und Rückkehr eindeutig festlegen.
- [ ] Kartenrückseite und aufgedeckte Seite gestalten.
- [ ] Flüssige Umdreh-Animation erstellen.
- [ ] Bedienung und Layout auf schmalen Bildschirmen prüfen.

### Abnahmepunkte aus der Checkliste

- [ ] Spielfeld entspricht der gewählten Größe.
- [ ] Gewähltes Theme ist in Farben und Motiven erkennbar.
- [ ] Punktestand, aktueller Spieler und „Exit Game“ stehen über dem Spielfeld.
- [ ] Karten drehen sich beim Klick flüssig um.

### Lernkontrolle 7

- [ ] Ich kann Datenmodell, DOM-Element und CSS-Klasse auseinanderhalten.
- [ ] Ich kann erklären, wie TypeScript und SCSS bei einer Karte zusammenspielen.
- [ ] Ich verstehe die Grundidee der Flip-Animation.

---

## 8. Spiellogik umsetzen

Voraussetzung: Karten werden korrekt gerendert.

Ziel: Ein kompletter Zug mit zwei Karten funktioniert zuverlässig.

- [ ] Kartenklick mit einem Event behandeln.
- [ ] Bereits gefundene oder bereits offene Karten nicht erneut auswählen.
- [ ] Höchstens zwei Karten gleichzeitig prüfen.
- [ ] Während der Paarprüfung weitere Klicks kurz sperren.
- [ ] Gleiches Paar erkennen und offen lassen.
- [ ] Punkt für den aktuellen Spieler vergeben.
- [ ] Ungleiches Paar nach kurzer Pause wieder verdecken.
- [ ] Nach der gemeinsam festgelegten Regel den Spieler wechseln.
- [ ] Statusanzeige nach jedem Zug aktualisieren.
- [ ] Einen neuen Spielzustand sauber initialisieren.

### Lernkontrolle 8

- [ ] Ich kann den Ablauf eines Spielzugs Schritt für Schritt erklären.
- [ ] Ich kann Zustandsvariablen von DOM-Elementen unterscheiden.
- [ ] Ich verstehe, warum eine kurze Klicksperre nötig ist.

---

## 9. User Story 5: Spielende und neue Runde

Voraussetzung: Paare und Punkte werden korrekt verarbeitet.

Ziel: Die App erkennt das Ende, zeigt das Ergebnis und kann neu starten.

- [ ] Erkennen, wann alle Paare gefunden wurden.
- [ ] „Game over“-Anzeige einblenden.
- [ ] Aktuelle beziehungsweise finale Punktestände anzeigen.
- [ ] Spieler mit den meisten Punkten als Gewinner anzeigen.
- [ ] Gleichstand sinnvoll behandeln.
- [ ] Neue Runde mit zurückgesetztem Spielzustand starten.
- [ ] Gemeinsam entscheiden, ob Einstellungen erhalten bleiben oder neu gewählt werden.

### Abnahmepunkte aus der Checkliste

- [ ] Nach Rundenende erscheint eine Meldung mit Punktestand.
- [ ] Der Gewinner wird korrekt angezeigt.
- [ ] Eine neue Runde kann begonnen werden.

### Lernkontrolle 9

- [ ] Ich kann die Endbedingung erklären.
- [ ] Ich weiß, welche Zustandswerte beim Neustart zurückgesetzt werden müssen.
- [ ] Ich kann Sieg und Gleichstand getrennt behandeln.

---

## 10. Codequalität, Konventionen und vollständige Abnahme

Voraussetzung: Alle fünf User Stories funktionieren.

Ziel: Verständlicher eigener Code und eine systematische Abschlussprüfung.

- [ ] HTML anhand der verlinkten HTML-Coding-Konvention prüfen.
- [ ] TypeScript anhand der verlinkten TypeScript-Coding-Konvention prüfen.
- [ ] Aussagekräftige Namen und kleine, klar zuständige Funktionen prüfen.
- [ ] Unnötige Wiederholungen vorsichtig reduzieren, ohne den Code zu verkomplizieren.
- [ ] Verbleibende TypeScript-Fehler und Warnungen beheben.
- [ ] Produktions-Build erfolgreich ausführen.
- [ ] Alle drei Spielfeldgrößen manuell testen.
- [ ] Beide Spielerfarben, mindestens zwei Themes und mindestens zwei Layouts testen.
- [ ] Start, Settings, Spielzüge, Exit, Spielende und neue Runde testen.
- [ ] Tastaturbedienung, Fokus, Kontrast und Alternativtexte prüfen.
- [ ] Darstellung in mindestens einer schmalen und einer breiten Ansicht prüfen.
- [ ] Optionale Extras getrennt dokumentieren.
- [ ] Gesamte PDF-Checkliste ein letztes Mal Punkt für Punkt abhaken.

### Abschlusswiederholung

- [ ] Ich kann den Datenfluss von den Settings bis zum Spielende erklären.
- [ ] Ich kann die verwendeten TypeScript-Typen begründen.
- [ ] Ich kann die verwendeten SCSS-Funktionen und die erzeugten CSS-Regeln erklären.
- [ ] Ich kann mindestens eine einfachere und eine mögliche spätere professionellere Lösung vergleichen.

---

## Noch nicht aufgelöste Punkte

- Für Code Vibes, Gaming und Food sind bisher hauptsächlich Design-Screens vorhanden; wir müssen später prüfen, ob die einzelnen Kartenmotive noch exportiert werden müssen.
- Die Begriffe Theme und Layout müssen vor Abschnitt 5 eindeutig voneinander abgegrenzt werden.
- Die verlinkten Google-Dokumente zu HTML- und TypeScript-Konventionen waren beim Erstellen dieses Plans nicht öffentlich auslesbar. Sie bleiben verbindliche Prüfpunkte, sobald Zugriff möglich ist.
