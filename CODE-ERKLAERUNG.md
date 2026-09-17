# Den Memory-Code verstehen

Diese Erklärung beschreibt den aktuellen Stand nach dem Mentorfeedback. Öffne beim Lesen am besten gleichzeitig `src/game-types.ts`, `src/game-data.ts` und `src/main.ts`.

## Die drei TypeScript-Dateien

`game-types.ts` beschreibt, wie die Daten aussehen. Zum Beispiel ist eine `MemoryCard` ein Objekt mit einer ID, einer Paar-ID, einem Bildpfad, einer Beschriftung und zwei Ja/Nein-Werten für ihren Zustand.

`game-data.ts` enthält feste Spielwerte und die Namen der vorhandenen Bilddateien. `getMotifs(theme)` erstellt daraus die Pfade zu den Bildern eines Themes.

`main.ts` steuert die sichtbare App: Einstellungen lesen, Karten erstellen, Ansichten wechseln, Klicks auswerten, Punkte vergeben und Dialoge öffnen.

## Typen in einfachen Worten

`MemoryCard` beschreibt **eine** Karte. `MemoryCard[]` bedeutet **eine Liste aus Memory-Karten**.

Ein Parameter ist ein Wert, den eine Funktion beim Aufruf bekommt:

```ts
function flipCard(card: MemoryCard): void
```

Hier ist `card` der Parameter. Die Funktion bekommt eine Karte und dreht genau diese Karte um.

Der Typ hinter der Klammer ist der Rückgabewert. `void` bedeutet, dass die Funktion keinen neuen Wert zurückgibt. Sie verändert stattdessen den Zustand der Karte und das passende HTML-Element.

## Warum die Mischfunktion kein Generic mehr verwendet

Ein Generic ist ein Platzhalter für einen noch unbekannten Typ. Eine Schreibweise wie `shuffle<T>` wäre sinnvoll, wenn dieselbe Funktion Karten, Zahlen und andere Listen mischen sollte.

In dieser App mischt die Funktion ausschließlich Memory-Karten. Deshalb verwendet sie den konkreten Typ:

```ts
function shuffleCards(cards: MemoryCard[]): MemoryCard[]
```

Damit ist beim Lesen sofort klar: Die Funktion bekommt eine Kartenliste und gibt eine Kartenliste zurück.

## So funktioniert das Mischen

1. `cards.slice()` erstellt eine Kopie. Die ursprüngliche Liste bleibt unverändert.
2. Die Schleife beginnt bei der letzten Karte.
3. Für die aktuelle Position wird eine zufällige Position bestimmt.
4. Eine Zwischenvariable merkt sich die aktuelle Karte.
5. Die beiden Karten tauschen ihre Position.
6. Am Ende gibt die Funktion die gemischte Kopie zurück.

Bei drei Karten könnte ein Tausch so aussehen:

`[A, B, C] → C mit A tauschen → [C, B, A]`

## Von den Einstellungen zum Spielfeld

```text
Formular abschicken
    ↓
readSettings()
    ↓
startRound()
    ↓
resetGameState()
    ↓
renderBoard()
    ↓
createDeck()
    ↓
Karten im HTML anzeigen
```

`readSettings()` prüft jeden Formularwert. Erst wenn Theme, Spieler, Kartenzahl und Layout gültig sind, entsteht ein `GameSettings`-Objekt.

`createDeck()` nimmt die benötigte Anzahl von Motiven. `createPair()` erstellt zu jedem Motiv zwei eigenständige Karten mit derselben `pairId`. Anschließend mischt `shuffleCards()` das fertige Deck.

## Ein Spielzug

`handleCardClick()` prüft zuerst, ob ein Klick erlaubt ist. Eine offene oder bereits gefundene Karte kann nicht erneut gewählt werden. Auch während eines Vergleichs oder bei geöffnetem Exit-Dialog werden weitere Klicks abgewiesen.

Nach der zweiten Karte ruft der Code `compareFlippedCards()` auf:

- Gleiche `pairId`: `resolveMatch()` lässt beide Karten offen und vergibt einen Punkt.
- Unterschiedliche `pairId`: `resolveMismatch()` dreht beide Karten zurück und wechselt den Spieler.

Der kurze Timer lässt die zweite Karte sichtbar, bevor das Ergebnis verarbeitet wird.

## Warum der Timer beim Verlassen beendet wird

Ohne `cancelComparison()` könnte ein alter Timer nach dem Verlassen weiterlaufen. Er würde dann Karten oder Punkte aus einer Runde verändern, die gar nicht mehr aktiv ist.

Bei bestätigtem Exit schließt der Code daher den Dialog und wechselt über `showScreen("settings")` zurück. `showScreen()` beendet dabei einen noch laufenden Vergleich. Beim nächsten Start setzt `resetGameState()` Karten, Punkte, Spieler und Klicksperre sauber zurück.

## Hover und bestätigte Auswahl

Beim Hover über ein Theme bekommt `updatePreview()` vorübergehend dieses Theme. Das angeklickte Radio-Feld ändert sich dabei nicht. Sobald der Mauszeiger das Label verlässt, liest die Funktion wieder die tatsächlich ausgewählte Einstellung.

Dadurch kann man Designs ansehen, ohne unbemerkt die Einstellung für den Spielstart zu ändern.

## Gute Reihenfolge zum eigenen Erklären

Erkläre den Code zuerst mit diesen fünf Fragen:

1. Welche Daten beschreibt `MemoryCard`?
2. Wie werden aus einem Motiv zwei Karten?
3. Warum kopiert die Mischfunktion ihre Kartenliste?
4. Woran erkennt der Code ein Paar?
5. Warum muss ein laufender Timer beim Exit beendet werden?

Wenn du diese fünf Antworten mit eigenen Worten geben kannst, ist der wichtigste Datenfluss des Spiels verstanden.
