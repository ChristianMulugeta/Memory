# Neuer Plan: Memory nach dem Mentorfeedback überarbeiten

Stand: 15.09.2026

## Ziel und aktueller Stand

Wir setzen die Korrekturen aus dem Feedback um. Der Code soll dabei so einfach sein, dass du den Ablauf beim Nachlesen verstehst und selbst erklären kannst.

Dieser Plan ist die aktuelle Grundlage für die Überarbeitung. Die bisherigen Arbeiten und Testergebnisse bleiben in `plan.md` als Verlauf erhalten. Die dort abgehakten Designpunkte müssen anhand des Mentorfeedbacks erneut geprüft werden.

Für diesen Plan wurden das Transkript, der aktuelle HTML-, TypeScript- und SCSS-Code, die vorhandenen Timer-Tests sowie die Designbilder für Home und Settings angesehen. Die erneute Prüfung der PDF-Vorgaben und der Herkunft der Grafiken steht noch aus. Die folgenden Änderungen sind geplant, noch nicht umgesetzt.

## Umsetzungsstand vom 15.09.2026

- [x] TypeScript vereinfacht: konkrete Kartentypen, einfache Schleifen, kein eigenes Generic und keine Emoji-Sonderbehandlung.
- [x] Alle Funktionen mit englischem TSDoc einschließlich Parameter und Rückgabewert dokumentiert.
- [x] Vorhandene Bilddateien für alle vier Themes eingebunden; jedes Theme besitzt mindestens 18 Motive.
- [x] Controller-Ausschnitt korrigiert, sodass Steuerkreuz und Tasten sichtbar bleiben.
- [x] Settings-Header vor `main` verschoben und Desktop-Layout mit der Vorlage verglichen.
- [x] Hover-Vorschau für Game Themes ergänzt, ohne die bestätigte Auswahl zu verändern.
- [x] Untere Leiste zeigt Theme, Spieler, Kartenzahl und Layout ohne Verschiebung an.
- [x] Exit-Dialog mit `No, back to game` und `Exit game` ergänzt; bestätigter Exit führt zu den Settings.
- [x] Acht Logiktests, Produktions-Build und Browserprüfung mit 24 Kombinationen in breiter und schmaler Ansicht bestanden.
- [x] Neue Screenshots unter `design/review/mentor-*.png` visuell geprüft.
- [x] Anfängerfreundliche Erklärung in `CODE-ERKLAERUNG.md` ergänzt.
- [ ] Herkunft der vorhandenen Karten- und Bedienicons gegen die externe Designquelle bestätigen. Dafür werden die Originalexporte oder Zugriff auf die Quelle benötigt.
- [ ] Persönliche Lernkontrolle mit eigenen Worten durchführen; diese kann kein automatischer Test bestätigen.

## So schreiben und erklären wir den Code

- Wir bearbeiten jeweils eine überschaubare Änderung und erklären ihren Ablauf auf Deutsch.
- Variablen, Funktionen und Kommentare im Quellcode bekommen verständliche englische Namen beziehungsweise Texte.
- Jede Funktion hat eine klar erkennbare Aufgabe. Mehrere Anweisungen werden nicht in eine Zeile gepresst.
- Wir bevorzugen einfache `if`-Abfragen und Schleifen, wenn sie den Ablauf verständlicher machen.
- Typen beschreiben die tatsächlich verwendeten Daten, zum Beispiel `MemoryCard[]` für eine Liste von Karten.
- Eigene generische Hilfsfunktionen werden durch konkrete Lösungen ersetzt, wo keine Wiederverwendung für verschiedene Typen gebraucht wird. Ein Generic ist ein Platzhalter für einen Typ.
- Wir behalten hilfreiche TypeScript-Prüfungen bei. `any` oder ungeprüfte Typbehauptungen mit `as` dienen nicht als Abkürzung.
- Funktionen erhalten englische TSDoc-Kommentare: eine kurze Beschreibung, `@param` für jeden Parameter und `@returns` für den Rückgabewert beziehungsweise einen Hinweis auf `void`.
- Die vorhandene Aufteilung bleibt übersichtlich: `game-types.ts` beschreibt Daten, `game-data.ts` enthält Motive und feste Werte, `main.ts` steuert den Ablauf.
- HTML-Strukturen bleiben in HTML; SCSS-Regeln werden gut lesbar formatiert und nur flach verschachtelt.
- Nach jedem Abschnitt halten wir fest: Was wurde geändert? Warum? Wie wurde es geprüft? Was solltest du erklären können?

## 1. Vorgaben und Originalgrafiken klären — nächster Schritt

**Feedback:** 0:40–1:13 zu Hover, 4:10–4:33 zu Originalbildern.

- [ ] `lists/Memory Checkliste.pdf` und beide Coding-Konventionen erneut lesen. Verbindliche Vorgaben wie Funktionslänge, Benennung und Dokumentation festhalten.
- [ ] Die vorhandenen Bilder unter `design/screens` mit den zugehörigen Ansichten vergleichen.
- [ ] Die Grafiken unter `public/assets/cards` und in `public/assets/icons.svg` mit den Originalen aus dem Design abgleichen. Eine vorhandene SVG-Datei ist noch kein Nachweis, dass sie aus der Vorlage stammt.
- [ ] Fehlende Originale für Controller, Kartenmotive, Kartenrückseiten und Bedienelemente auflisten und aus der Designquelle beschaffen. Fehlender Zugriff auf die Designquelle wird konkret benannt.
- [ ] Hover für Game Themes als geforderte Korrektur einplanen. Ob weitere Auswahlgruppen eine Vorschau beim Darüberfahren benötigen, anhand der Checkliste beziehungsweise des Prototyps klären; der Mentor war dabei ausdrücklich unsicher.

**Fertig, wenn:** Wir wissen, welche Grafiken verwendet werden dürfen und welches Verhalten die Vorlage verlangt. Fehlende Quellen sind als offene Punkte dokumentiert.

## 2. TypeScript einfacher machen und dokumentieren

**Feedback:** 5:01–6:32 zu Kommentaren, Typisierung, Generics und eigenem Verständnis.

**Dateien:** `src/main.ts`, `src/game-types.ts`, `src/game-data.ts`.

- [ ] Mit der Mischfunktion beginnen: Aus `shuffle<T>` wird `shuffleCards`, die ausdrücklich `MemoryCard[]` annimmt und zurückgibt. Sie wird aktuell nur für Karten verwendet.
- [ ] Beim Tauschen zweier Karten eine benannte Zwischenvariable verwenden. Die Liste vor dem Mischen kopieren, damit die übergebene Liste erhalten bleibt.
- [ ] `readOption<T>` durch leicht nachvollziehbare Prüfungen der einzelnen Formularwerte ersetzen. Ungültige Werte weiterhin abweisen.
- [ ] Die Kartenerstellung mit einer einfachen Schleife und zwei eigenständigen Karten pro Motiv lesbar machen. Verkettete Array-Operationen nur behalten, wenn ihr Nutzen verständlich ist.
- [ ] Weitere schwer lesbare Stellen einzeln prüfen, zum Beispiel verschachtelte Kurzbedingungen und mehrere Eigenschaften auf einer Zeile.
- [ ] Deutsche Quellcode-Kommentare in TypeScript und HTML durch englische Dokumentation ersetzen. Sichtbare App-Texte und die deutschen Lernerklärungen sind davon getrennt.
- [ ] Vorhandene Prüfungen für fehlende DOM-Elemente, Klicksperre und Timer beim Vereinfachen erhalten.

**Beispiel für den geplanten Stil** — noch keine Änderung am Spielcode:

```ts
/**
 * Returns a shuffled copy of the memory cards.
 * @param cards - The cards to shuffle. The original array stays unchanged.
 * @returns A new array containing the cards in random order.
 */
function shuffleCards(cards: MemoryCard[]): MemoryCard[] {
  const SHUFFLED_CARDS: MemoryCard[] = cards.slice();

  for (let index: number = SHUFFLED_CARDS.length - 1; index > 0; index -= 1) {
    const RANDOM_INDEX: number = Math.floor(Math.random() * (index + 1));
    const CURRENT_CARD: MemoryCard = SHUFFLED_CARDS[index];
    SHUFFLED_CARDS[index] = SHUFFLED_CARDS[RANDOM_INDEX];
    SHUFFLED_CARDS[RANDOM_INDEX] = CURRENT_CARD;
  }

  return SHUFFLED_CARDS;
}
```

Die Funktion kopiert die Kartenliste, geht sie von hinten durch und tauscht jede Karte mit einer zufällig gewählten Karte aus dem noch betrachteten Bereich. Der konkrete Typ `MemoryCard[]` genügt dafür.

**Fertig, wenn:** Die bisherigen Logiktests und der Build bestehen und du Parameter, Rückgabewert, Kopie und Kartentausch erklären kannst. Das persönliche Verständnis wird erst nach deiner eigenen Erklärung abgehakt.

## 3. Originalbilder einbinden und Controller korrigieren

**Feedback:** 0:10–0:22 und 4:10–4:33.

**Dateien:** `public/assets`, `src/game-data.ts`, `src/game-types.ts`, `src/main.ts`, `index.html`, `scss/main.scss`.

- [ ] Die bestätigten Originalgrafiken mit verständlichen Dateinamen ablegen und in den Motivdaten verknüpfen.
- [ ] Die derzeit verwendeten Emojis für Code Vibes, Gaming und Food durch die Originalmotive ersetzen.
- [ ] Vorschau und Spielfeld auf dieselben Motivdaten zugreifen lassen. Die zusätzliche Emoji-Vorschauliste entfernen, sobald sie überflüssig ist.
- [ ] Wenn alle Motive Bilder sind, den Bild-/Emoji-Sonderfall einschließlich `isImage` vereinfachen.
- [ ] Die Kartenrückseiten und sonstigen Icons ebenfalls mit dem jeweiligen Theme im Design abgleichen.
- [ ] Beim großen Controller auf dem Homescreen Position, Drehung, Größe und sichtbaren Ausschnitt anpassen. Steuerkreuz und Tasten müssen so sichtbar sein wie in der Vorlage.
- [ ] Die Controller-Animation über einen vollständigen Durchlauf ansehen und den Play-Button mitprüfen.

**Fertig, wenn:** Alle vier Themes Originalmotive anzeigen und der Controller zur Vorlage passt. Für 36 Karten stehen pro Theme mindestens 18 unterschiedliche Motive zur Verfügung; jedes gewählte Motiv kommt zweimal vor.

## 4. HTML-Struktur und Settings-Layout korrigieren

**Feedback:** 1:37–2:40.

**Dateien:** `index.html`, `scss/main.scss`, Navigation in `src/main.ts`.

- [ ] Den vom Mentor angesprochenen Settings-Seitenkopf als Header vor dem zentralen `main` anordnen und passend zur sichtbaren Ansicht ein- und ausblenden.
- [ ] Genau einen Hauptinhaltsbereich behalten. Überschriften, Formularbeschriftungen und Verknüpfungen über IDs nach der Änderung prüfen.
- [ ] Vorschau, Optionsgruppen, Überschrift und untere Startleiste bei gleicher Fenstergröße mit der Designvorlage vergleichen.
- [ ] Breiten, Höhen, Abstände und Ausrichtung korrigieren. Vorschau und Startleiste bekommen jeweils die in der Vorlage vorgesehenen Maße; sie sind dort unterschiedlich breit.
- [ ] Die vorhandene Layout-Auswahl beim Anordnen berücksichtigen und an der Checkliste prüfen.
- [ ] Die angepassten SCSS-Blöcke lesbar formatieren: eine Eigenschaft pro Zeile, verständliche Selektoren und wenig Verschachtelung.

**Zum Verständnis:** Ein `header` innerhalb einer `section` ist grundsätzlich erlaubt. Hier setzen wir die konkrete gewünschte Seitenstruktur um; daraus folgt keine allgemeine Regel, dass jeder Header außerhalb von `main` stehen muss.

**Fertig, wenn:** Der Settings-Seitenkopf vor `main` steht, die Navigation funktioniert und die Desktop-Anordnung zur Vorlage passt. Die vorhandene schmale Ansicht bleibt bedienbar.

## 5. Hover-Vorschau und Auswahlübersicht ergänzen

**Feedback:** 0:40–1:28 und 2:40–2:49.

**Dateien:** `index.html`, `src/main.ts`, `scss/main.scss`.

- [ ] Beim Darüberfahren über ein Game Theme dessen Design vorübergehend in der Vorschau anzeigen.
- [ ] Erst ein Klick beziehungsweise eine bewusste Tastaturauswahl übernimmt das Theme. Beim Verlassen der Hover-Vorschau erscheint wieder das tatsächlich ausgewählte Theme.
- [ ] Vorschau und gespeicherte Auswahl klar unterscheiden. Hover darf die Einstellungen für den Spielstart nicht unbemerkt ändern.
- [ ] Die untere Leiste nach jeder Auswahl aktualisieren: zum Beispiel `Food`, `Orange`, `24 cards` und der gewählte Layoutwert statt der unveränderten Platzhalter.
- [ ] Für Text und Auswahlmarkierungen ausreichend Platz reservieren. Änderungen an Text, Schriftgewicht oder Markierung dürfen benachbarte Elemente und den Start-Button nicht verschieben.
- [ ] Maus, Tastatur und Touch prüfen: Auswahl muss auch ohne Hover möglich sein; Tastaturfokus bleibt sichtbar.

**Fertig, wenn:** Hover nur die Vorschau ändert, die bestätigte Auswahl unten lesbar ist und Start genau diese Einstellungen verwendet. Beim Wechsel zwischen kurzen und langen Theme-Namen springt das Layout nicht.

## 6. Rückfrage beim Verlassen des Spiels einbauen

**Feedback:** 4:33–4:52.

**Dateien:** `index.html`, `src/main.ts`, `scss/main.scss`, betroffene Tests.

- [ ] Einen Dialog entsprechend der Designvorgabe mit `Back to game` und `Exit game` ergänzen. Ein natives HTML-`dialog` ist der Ausgangspunkt für eine einfache Umsetzung.
- [ ] Der Exit-Button öffnet zuerst diesen Dialog.
- [ ] `Back to game` schließt den Dialog und setzt dieselbe Runde mit erhaltenen Karten und Punkten fort.
- [ ] `Exit game` beendet die Runde, räumt laufende Timer auf und führt zu den **Settings** zurück. Die bisher gewählten Einstellungen bleiben erhalten.
- [ ] Während des Dialogs darf das Spielfeld keine weiteren Kartenklicks annehmen. Escape schließt die Rückfrage wie `Back to game`; der Fokus kehrt zum Exit-Button zurück.
- [ ] Den laufenden Kartenvergleich ausdrücklich berücksichtigen: Nach Abbrechen der Rückfrage darf das Spiel nicht gesperrt bleiben; nach bestätigtem Verlassen darf kein alter Vergleich weiterwirken.
- [ ] Das Ergebnisfenster und einen anschließend gestarteten neuen Durchlauf auf störende Wechselwirkungen mit dem Exit-Dialog prüfen.

**Fertig, wenn:** Beide Dialogaktionen funktionieren, die Rückkehr zu den Settings stimmt und auch ein Exit während eines Kartenvergleichs keinen fehlerhaften Spielzustand hinterlässt.

## 7. Abschließend prüfen und selbst erklären

- [ ] `npm.cmd test` ausführen; die vorhandenen Tests bei geänderten Funktionsnamen und Datenstrukturen sinnvoll anpassen.
- [ ] Für den neuen Exit-Ablauf gezielt prüfen: Abbrechen während eines Vergleichs, bestätigtes Verlassen während eines Vergleichs und anschließender Neustart.
- [ ] `npm.cmd run build` ausführen; Typprüfung und Produktions-Build müssen erfolgreich sein.
- [ ] Den vorhandenen Browsertest an die Originalbilder und das neue Exit-Verhalten anpassen und ausführen.
- [ ] Alle vier Themes, beide Layouts, beide Startspieler und alle drei Kartenzahlen prüfen. Sieg, Gleichstand, Spielerwechsel, Klicksperre und neue Runde mitprüfen.
- [ ] Home, Settings, Hover-Zustände, Auswahlübersicht und Exit-Dialog visuell mit den Vorlagen vergleichen. Ein erfolgreicher Build bestätigt keine Designübereinstimmung.
- [ ] Die Desktop-Ansicht und eine schmale Ansicht sowie die Tastaturbedienung prüfen.
- [ ] README und Plan an den tatsächlich geprüften Stand anpassen. Neue Korrekturen erst nach Prüfung abhaken.

### Deine Lernkontrolle

- [ ] Ich kann erklären, was `MemoryCard`, `MemoryCard[]`, ein Parameter und ein Rückgabewert sind.
- [ ] Ich kann erklären, was ein Generic ermöglicht und warum unsere Mischfunktion keinen eigenen Typparameter benötigt.
- [ ] Ich kann das Mischen an einer kleinen Kartenliste Schritt für Schritt zeigen.
- [ ] Ich kann von der Formularauswahl bis zum fertigen Kartendeck erklären, welche Funktion welche Aufgabe hat.
- [ ] Ich kann Hover-Vorschau und bestätigte Auswahl unterscheiden.
- [ ] Ich kann erklären, warum beim Verlassen ein Timer beendet werden muss.
- [ ] Ich kann mit eigenen Worten auf die Fragen des Mentors antworten. Eine schriftliche Erklärung oder ein kurzes Video entsteht erst aus diesem Verständnis.

## Reihenfolge in einem Satz

Vorgaben und Originale klären → TypeScript vereinfachen → Originalbilder und Controller korrigieren → HTML und Settings ausrichten → Hover und Auswahlübersicht ergänzen → Exit-Dialog umsetzen → testen und selbst erklären.
