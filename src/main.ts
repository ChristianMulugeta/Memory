import type { BoardSize, CardMotif, GameSettings, Layout, MemoryCard, PlayerColor, Screen, Theme } from "./game-types";
import { BOARD_COLUMNS, BOARD_SIZES, CARDS_PER_PAIR, getMotifs, LAYOUTS, MATCH_DELAY_MS, MISMATCH_DELAY_MS, PAIR_COUNTS, PLAYERS, THEME_MOTIFS, THEMES } from "./game-data";
import "../scss/main.scss";

const HOME_SCREEN: HTMLElement | null = document.querySelector("#home-screen");
const SETTINGS_SCREEN: HTMLElement | null = document.querySelector("#settings-screen");
const GAME_SCREEN: HTMLElement | null = document.querySelector("#game-screen");
const PLAY_BUTTON: HTMLButtonElement | null = document.querySelector("#play-button");
const BACK_BUTTON: HTMLButtonElement | null = document.querySelector("#back-button");
const SETTINGS_FORM: HTMLFormElement | null = document.querySelector("#settings-form");
const SETTINGS_FEEDBACK: HTMLElement | null = document.querySelector("#settings-feedback");
const SETTINGS_PREVIEW: HTMLElement | null = document.querySelector("#settings-preview");
const PREVIEW_MOTIF: HTMLElement | null = document.querySelector("#preview-motif");
const PREVIEW_PLAYER: HTMLElement | null = document.querySelector("#preview-player");
const GAME_BOARD: HTMLElement | null = document.querySelector("#game-board");
const CARD_TEMPLATE: HTMLTemplateElement | null = document.querySelector("#card-template");
const EXIT_BUTTON: HTMLButtonElement | null = document.querySelector("#exit-button");
const CURRENT_PLAYER: HTMLElement | null = document.querySelector("#current-player");
const BLUE_SCORE: HTMLElement | null = document.querySelector("#blue-score");
const ORANGE_SCORE: HTMLElement | null = document.querySelector("#orange-score");
const RESULT_OVERLAY: HTMLElement | null = document.querySelector("#result-overlay");
const RESULT_TITLE: HTMLElement | null = document.querySelector("#result-title");
const RESULT_MESSAGE: HTMLElement | null = document.querySelector("#result-message");
const FINAL_BLUE_SCORE: HTMLElement | null = document.querySelector("#final-blue-score");
const FINAL_ORANGE_SCORE: HTMLElement | null = document.querySelector("#final-orange-score");
const NEW_ROUND_BUTTON: HTMLButtonElement | null = document.querySelector("#new-round-button");
const RESULT_HOME_BUTTON: HTMLButtonElement | null = document.querySelector("#result-home-button");

let gameSettings: GameSettings | null = null;
let deck: MemoryCard[] = [];
let flippedCards: MemoryCard[] = [];
let activePlayer: PlayerColor = "blue";
let scores: Record<PlayerColor, number> = { blue: 0, orange: 0 };
let boardLocked: boolean = false;
let comparisonTimer: number | null = null;

/** Liest nur einen Wert aus den erlaubten Formularoptionen aus. */
function readOption<T extends string>(data: FormData, name: string, options: T[]): T | null {
  const VALUE: FormDataEntryValue | null = data.get(name);
  return options.find((option: T): boolean => option === VALUE) ?? null;
}

/** Prüft die Formularwerte, bevor sie als Spieleinstellungen verwendet werden. */
function readSettings(): GameSettings | null {
  if (!SETTINGS_FORM) return null;
  const DATA: FormData = new FormData(SETTINGS_FORM);
  const THEME: Theme | null = readOption(DATA, "theme", THEMES);
  const PLAYER: PlayerColor | null = readOption(DATA, "player", PLAYERS);
  const BOARD_SIZE: BoardSize | null = readOption(DATA, "boardSize", BOARD_SIZES);
  const LAYOUT: Layout | null = readOption(DATA, "layout", LAYOUTS);
  if (!THEME || !PLAYER || !BOARD_SIZE || !LAYOUT) return null;
  return { theme: THEME, player: PLAYER, boardSize: BOARD_SIZE, layout: LAYOUT };
}

/** Überträgt Theme und Layout auf einen Vorschau- oder Spielbereich. */
function applyAppearance(element: HTMLElement | null, settings: GameSettings): void {
  if (!element) return;
  element.dataset.layout = settings.layout;
  element.dataset.theme = settings.theme;
}

/** Aktualisiert die Vorschau nach einer gültigen Auswahl. */
function updatePreview(): void {
  const SETTINGS: GameSettings | null = readSettings();
  if (!SETTINGS) return;
  applyAppearance(SETTINGS_PREVIEW, SETTINGS);
  if (PREVIEW_MOTIF) {
    PREVIEW_MOTIF.replaceChildren();
    if (SETTINGS.theme === "da-projects") {
      const IMAGE: HTMLImageElement = document.createElement("img");
      IMAGE.src = "./assets/cards/da-projects/wave.png";
      IMAGE.alt = "Welle";
      PREVIEW_MOTIF.append(IMAGE);
    } else {
      PREVIEW_MOTIF.textContent = THEME_MOTIFS[SETTINGS.theme];
    }
  }
  if (PREVIEW_PLAYER) PREVIEW_PLAYER.className = `preview-player preview-player--${SETTINGS.player}`;
}

/** Wechselt die Ansicht und stoppt beim Verlassen einen laufenden Vergleich. */
function showScreen(screen: Screen): void {
  if (!HOME_SCREEN || !SETTINGS_SCREEN || !GAME_SCREEN) return;
  if (screen !== "game") cancelComparison();
  HOME_SCREEN.hidden = screen !== "home";
  SETTINGS_SCREEN.hidden = screen !== "settings";
  GAME_SCREEN.hidden = screen !== "game";
}

/** Mischt eine Kopie des Arrays mit dem Fisher-Yates-Verfahren. */
function shuffle<T>(items: T[]): T[] {
  const SHUFFLED: T[] = [...items];
  for (let index: number = SHUFFLED.length - 1; index > 0; index -= 1) {
    const RANDOM_INDEX: number = Math.floor(Math.random() * (index + 1));
    [SHUFFLED[index], SHUFFLED[RANDOM_INDEX]] = [SHUFFLED[RANDOM_INDEX], SHUFFLED[index]];
  }
  return SHUFFLED;
}

/** Erzeugt eine einzelne verdeckte Karte mit eindeutiger ID. */
function createCard(motif: CardMotif, pairIndex: number, copy: string, isImage: boolean): MemoryCard {
  return {
    id: `${pairIndex}-${copy}`, pairId: String(pairIndex),
    motif: motif.value, label: motif.label, isImage, isFlipped: false, isMatched: false,
  };
}

/** Erstellt zwei eigenständige Karten für dasselbe Motiv. */
function createPair(motif: CardMotif, pairIndex: number, isImage: boolean): MemoryCard[] {
  return [createCard(motif, pairIndex, "a", isImage), createCard(motif, pairIndex, "b", isImage)];
}

/** Erstellt die passende Anzahl an Paaren und mischt das Deck. */
function createDeck(settings: GameSettings): MemoryCard[] {
  const MOTIFS: CardMotif[] = getMotifs(settings.theme).slice(0, PAIR_COUNTS[settings.boardSize]);
  const CARDS: MemoryCard[] = MOTIFS.flatMap((motif: CardMotif, index: number): MemoryCard[] =>
    createPair(motif, index, settings.theme === "da-projects"));
  return shuffle(CARDS);
}

/** Befüllt die Kartenvorderseite mit einem beschrifteten Bild oder Emoji. */
function renderMotif(button: HTMLButtonElement, card: MemoryCard): void {
  const FRONT: HTMLElement | null = button.querySelector(".memory-card__front");
  if (!FRONT) return;
  if (!card.isImage) {
    FRONT.textContent = card.motif;
    return;
  }
  const IMAGE: HTMLImageElement = document.createElement("img");
  IMAGE.src = card.motif;
  IMAGE.alt = card.label;
  FRONT.append(IMAGE);
}

/** Klont die HTML-Vorlage und hängt eine verdeckte Karte an das Spielfeld. */
function appendCard(card: MemoryCard): void {
  const TEMPLATE_BUTTON: HTMLButtonElement | null = CARD_TEMPLATE?.content.querySelector("button") ?? null;
  if (!TEMPLATE_BUTTON || !GAME_BOARD) return;
  const CLONE: Node = TEMPLATE_BUTTON.cloneNode(true);
  if (!(CLONE instanceof HTMLButtonElement)) return;
  CLONE.dataset.cardId = card.id;
  renderMotif(CLONE, card);
  GAME_BOARD.append(CLONE);
}

/** Baut das Spielfeld aus den gewählten Einstellungen neu auf. */
function renderBoard(settings: GameSettings): void {
  if (!GAME_BOARD) return;
  deck = createDeck(settings);
  GAME_BOARD.style.setProperty("--board-columns", String(BOARD_COLUMNS[settings.boardSize]));
  applyAppearance(GAME_SCREEN, settings);
  GAME_BOARD.replaceChildren();
  deck.forEach(appendCard);
  updateStatus();
}

/** Zeigt den aktuellen Spieler und beide Punktestände. */
function updateStatus(): void {
  if (CURRENT_PLAYER) {
    CURRENT_PLAYER.className = `score--${activePlayer}`;
    const LABEL: HTMLElement | null = CURRENT_PLAYER.querySelector("span");
    if (LABEL) LABEL.textContent = activePlayer === "blue" ? "Blue" : "Orange";
  }
  if (BLUE_SCORE) BLUE_SCORE.textContent = String(scores.blue);
  if (ORANGE_SCORE) ORANGE_SCORE.textContent = String(scores.orange);
}

/** Verhindert, dass ein alter Timer nach Verlassen oder Neustart weiterarbeitet. */
function cancelComparison(): void {
  if (comparisonTimer === null) return;
  window.clearTimeout(comparisonTimer);
  comparisonTimer = null;
}

/** Setzt Punkte, Spieler und Kartenauswahl für eine neue Runde zurück. */
function resetGameState(startingPlayer: PlayerColor): void {
  cancelComparison();
  flippedCards = [];
  activePlayer = startingPlayer;
  scores = { blue: 0, orange: 0 };
  boardLocked = false;
  if (RESULT_OVERLAY) RESULT_OVERLAY.hidden = true;
}

/** Formuliert das Ergebnis einschließlich des Gleichstands. */
function updateResultText(): void {
  const IS_DRAW: boolean = scores.blue === scores.orange;
  const WINNER: string = scores.blue > scores.orange ? "Blue" : "Orange";
  if (RESULT_TITLE) RESULT_TITLE.textContent = IS_DRAW ? "It’s a draw!" : `${WINNER} wins!`;
  if (RESULT_MESSAGE) {
    RESULT_MESSAGE.textContent = IS_DRAW
      ? "Ihr habt gleich viele Paare gefunden." : `${WINNER} hat die meisten Paare gefunden.`;
  }
}

/** Beendet die Runde und zeigt die finalen Punkte an. */
function finishGame(): void {
  boardLocked = true;
  updateResultText();
  if (FINAL_BLUE_SCORE) FINAL_BLUE_SCORE.textContent = String(scores.blue);
  if (FINAL_ORANGE_SCORE) FINAL_ORANGE_SCORE.textContent = String(scores.orange);
  if (RESULT_OVERLAY) RESULT_OVERLAY.hidden = false;
  NEW_ROUND_BUTTON?.focus();
}

/** Findet das sichtbare Kartenelement anhand seiner eindeutigen ID. */
function getCardElement(card: MemoryCard): HTMLButtonElement | null {
  return GAME_BOARD?.querySelector<HTMLButtonElement>(`[data-card-id="${card.id}"]`) ?? null;
}

/** Deckt eine Karte auf und gibt ihr Motiv für Screenreader bekannt. */
function flipCard(card: MemoryCard): void {
  card.isFlipped = true;
  const ELEMENT: HTMLButtonElement | null = getCardElement(card);
  ELEMENT?.classList.add("memory-card--flipped");
  ELEMENT?.setAttribute("aria-label", `Aufgedeckte Memory-Karte: ${card.label}`);
}

/** Verdeckt eine Karte wieder, ohne ihr Motiv über den Namen zu verraten. */
function hideCard(card: MemoryCard): void {
  card.isFlipped = false;
  const ELEMENT: HTMLButtonElement | null = getCardElement(card);
  ELEMENT?.classList.remove("memory-card--flipped");
  ELEMENT?.setAttribute("aria-label", "Verdeckte Memory-Karte");
}

/** Markiert eine gefundene Karte und verhindert weitere Auswahlen. */
function markCard(card: MemoryCard): void {
  card.isMatched = true;
  const ELEMENT: HTMLButtonElement | null = getCardElement(card);
  ELEMENT?.classList.add("memory-card--matched");
  ELEMENT?.setAttribute("aria-label", `Gefundenes Kartenpaar: ${card.label}`);
  if (ELEMENT) ELEMENT.disabled = true;
}

/** Schließt den passenden Vergleich ab und prüft auf das Rundenende. */
function resolveMatch(): void {
  comparisonTimer = null;
  flippedCards.forEach(markCard);
  scores[activePlayer] += 1;
  flippedCards = [];
  boardLocked = false;
  updateStatus();
  if (deck.every((card: MemoryCard): boolean => card.isMatched)) finishGame();
}

/** Verdeckt ein ungleiches Paar und übergibt den Zug an den anderen Spieler. */
function resolveMismatch(): void {
  comparisonTimer = null;
  flippedCards.forEach(hideCard);
  flippedCards = [];
  activePlayer = activePlayer === "blue" ? "orange" : "blue";
  boardLocked = false;
  updateStatus();
}

/** Sperrt Kartenklicks und plant die zum Vergleich passende Verzögerung. */
function compareFlippedCards(): void {
  const [FIRST_CARD, SECOND_CARD]: MemoryCard[] = flippedCards;
  if (!FIRST_CARD || !SECOND_CARD) return;
  boardLocked = true;
  const IS_MATCH: boolean = FIRST_CARD.pairId === SECOND_CARD.pairId;
  comparisonTimer = window.setTimeout(
    IS_MATCH ? resolveMatch : resolveMismatch, IS_MATCH ? MATCH_DELAY_MS : MISMATCH_DELAY_MS);
}

/** Akzeptiert nur verdeckte, noch nicht gefundene Karten bei freiem Spielfeld. */
function handleCardClick(cardId: string): void {
  if (boardLocked) return;
  const CARD: MemoryCard | undefined = deck.find((item: MemoryCard): boolean => item.id === cardId);
  if (!CARD || CARD.isFlipped || CARD.isMatched) return;
  flipCard(CARD);
  flippedCards.push(CARD);
  if (flippedCards.length === CARDS_PER_PAIR) compareFlippedCards();
}

/** Startet eine frische Runde mit den gespeicherten Einstellungen. */
function startRound(): void {
  if (!gameSettings) return;
  resetGameState(gameSettings.player);
  renderBoard(gameSettings);
  showScreen("game");
}

/** Übernimmt gültige Einstellungen oder zeigt einen verständlichen Hinweis. */
function handleSettingsSubmit(event: SubmitEvent): void {
  event.preventDefault();
  gameSettings = readSettings();
  if (SETTINGS_FEEDBACK) {
    SETTINGS_FEEDBACK.textContent = gameSettings ? "" : "Bitte wähle in jeder Gruppe eine gültige Option.";
  }
  startRound();
}

/** Ordnet einen Klick auf dem Spielfeld der zugehörigen Karte zu. */
function handleBoardClick(event: MouseEvent): void {
  if (!(event.target instanceof Element)) return;
  const ELEMENT: HTMLButtonElement | null = event.target.closest(".memory-card");
  const CARD_ID: string | undefined = ELEMENT?.dataset.cardId;
  if (CARD_ID) handleCardClick(CARD_ID);
}

/** Öffnet die Einstellungen und aktualisiert deren Vorschau. */
function openSettings(): void {
  updatePreview();
  showScreen("settings");
}

/** Kehrt zum Homescreen zurück. */
function returnHome(): void {
  showScreen("home");
}

/** Verknüpft die Navigation und die Spielaktionen mit ihren Bedienelementen. */
function registerEvents(): void {
  PLAY_BUTTON?.addEventListener("click", openSettings);
  BACK_BUTTON?.addEventListener("click", returnHome);
  SETTINGS_FORM?.addEventListener("submit", handleSettingsSubmit);
  SETTINGS_FORM?.addEventListener("change", updatePreview);
  EXIT_BUTTON?.addEventListener("click", returnHome);
  NEW_ROUND_BUTTON?.addEventListener("click", startRound);
  RESULT_HOME_BUTTON?.addEventListener("click", returnHome);
  GAME_BOARD?.addEventListener("click", handleBoardClick);
}

registerEvents();
