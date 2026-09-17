import type {
  BoardSize,
  CardMotif,
  GameSettings,
  Layout,
  MemoryCard,
  PlayerColor,
  Screen,
  Theme,
} from "./game-types";
import {
  BOARD_COLUMNS,
  CARDS_PER_PAIR,
  getMotifs,
  MATCH_DELAY_MS,
  MISMATCH_DELAY_MS,
  PAIR_COUNTS,
} from "./game-data";
import "../scss/main.scss";

const SETTINGS_HEADER: HTMLElement | null = document.querySelector("#settings-header");
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
const SELECTED_THEME: HTMLElement | null = document.querySelector("#selected-theme");
const SELECTED_PLAYER: HTMLElement | null = document.querySelector("#selected-player");
const SELECTED_BOARD_SIZE: HTMLElement | null = document.querySelector("#selected-board-size");
const SELECTED_LAYOUT: HTMLElement | null = document.querySelector("#selected-layout");
const GAME_BOARD: HTMLElement | null = document.querySelector("#game-board");
const CARD_TEMPLATE: HTMLTemplateElement | null = document.querySelector("#card-template");
const EXIT_BUTTON: HTMLButtonElement | null = document.querySelector("#exit-button");
const EXIT_DIALOG: HTMLDialogElement | null = document.querySelector("#exit-dialog");
const BACK_TO_GAME_BUTTON: HTMLButtonElement | null = document.querySelector("#back-to-game-button");
const CONFIRM_EXIT_BUTTON: HTMLButtonElement | null = document.querySelector("#confirm-exit-button");
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
let exitDialogOpen: boolean = false;

/**
 * Reads a valid theme from the form data.
 * @param data - The current settings form data.
 * @returns The selected theme or null for an invalid value.
 */
function readTheme(data: FormData): Theme | null {
  const VALUE: FormDataEntryValue | null = data.get("theme");
  if (VALUE === "code-vibes" || VALUE === "gaming") return VALUE;
  if (VALUE === "da-projects" || VALUE === "food") return VALUE;
  return null;
}

/**
 * Reads a valid player color from the form data.
 * @param data - The current settings form data.
 * @returns The selected player color or null for an invalid value.
 */
function readPlayer(data: FormData): PlayerColor | null {
  const VALUE: FormDataEntryValue | null = data.get("player");
  if (VALUE === "blue" || VALUE === "orange") return VALUE;
  return null;
}

/**
 * Reads a valid board size from the form data.
 * @param data - The current settings form data.
 * @returns The selected board size or null for an invalid value.
 */
function readBoardSize(data: FormData): BoardSize | null {
  const VALUE: FormDataEntryValue | null = data.get("boardSize");
  if (VALUE === "4x4" || VALUE === "4x6" || VALUE === "6x6") return VALUE;
  return null;
}

/**
 * Reads a valid layout from the form data.
 * @param data - The current settings form data.
 * @returns The selected layout or null for an invalid value.
 */
function readLayout(data: FormData): Layout | null {
  const VALUE: FormDataEntryValue | null = data.get("layout");
  if (VALUE === "light" || VALUE === "dark") return VALUE;
  return null;
}

/**
 * Reads and validates all settings form values.
 * @returns The selected game settings or null if one value is invalid.
 */
function readSettings(): GameSettings | null {
  if (!SETTINGS_FORM) return null;
  const DATA: FormData = new FormData(SETTINGS_FORM);
  const THEME: Theme | null = readTheme(DATA);
  const PLAYER: PlayerColor | null = readPlayer(DATA);
  const BOARD_SIZE: BoardSize | null = readBoardSize(DATA);
  const LAYOUT: Layout | null = readLayout(DATA);
  if (!THEME || !PLAYER || !BOARD_SIZE || !LAYOUT) return null;
  return { theme: THEME, player: PLAYER, boardSize: BOARD_SIZE, layout: LAYOUT };
}

/**
 * Applies a theme and layout to one visible area.
 * @param element - The preview or game element.
 * @param settings - The appearance settings to apply.
 * @returns Nothing.
 */
function applyAppearance(element: HTMLElement | null, settings: GameSettings): void {
  if (!element) return;
  element.dataset.layout = settings.layout;
  element.dataset.theme = settings.theme;
}

/**
 * Replaces the motif shown on the front preview card.
 * @param theme - The theme that should be previewed.
 * @returns Nothing.
 */
function updatePreviewImage(theme: Theme): void {
  if (!PREVIEW_MOTIF) return;
  const FIRST_MOTIF: CardMotif | undefined = getMotifs(theme)[0];
  if (!FIRST_MOTIF) return;
  const IMAGE: HTMLImageElement = document.createElement("img");
  IMAGE.src = FIRST_MOTIF.value;
  IMAGE.alt = FIRST_MOTIF.label;
  PREVIEW_MOTIF.replaceChildren(IMAGE);
}

/**
 * Converts a theme value into the text shown in the settings summary.
 * @param theme - The selected theme value.
 * @returns The readable theme name.
 */
function getThemeName(theme: Theme): string {
  if (theme === "code-vibes") return "Code vibes";
  if (theme === "da-projects") return "DA Projects";
  if (theme === "gaming") return "Gaming";
  return "Food";
}

/**
 * Shows the confirmed setting values below the preview.
 * @param settings - The settings selected in the form.
 * @returns Nothing.
 */
function updateSelectionSummary(settings: GameSettings): void {
  const CARD_COUNT: number = PAIR_COUNTS[settings.boardSize] * CARDS_PER_PAIR;
  if (SELECTED_THEME) SELECTED_THEME.textContent = getThemeName(settings.theme);
  if (SELECTED_PLAYER) SELECTED_PLAYER.textContent = settings.player;
  if (SELECTED_BOARD_SIZE) SELECTED_BOARD_SIZE.textContent = `${CARD_COUNT} cards`;
  if (SELECTED_LAYOUT) SELECTED_LAYOUT.textContent = settings.layout;
}

/**
 * Updates the settings preview without changing the confirmed radio selection.
 * @param previewTheme - An optional theme used only for hover or keyboard focus.
 * @returns Nothing.
 */
function updatePreview(previewTheme?: Theme): void {
  const SETTINGS: GameSettings | null = readSettings();
  if (!SETTINGS) return;
  const THEME: Theme = previewTheme ?? SETTINGS.theme;
  const PREVIEW_SETTINGS: GameSettings = { ...SETTINGS, theme: THEME };
  applyAppearance(SETTINGS_PREVIEW, PREVIEW_SETTINGS);
  updatePreviewImage(THEME);
  updateSelectionSummary(SETTINGS);
  if (PREVIEW_PLAYER) PREVIEW_PLAYER.className = `preview-player preview-player--${SETTINGS.player}`;
}

/**
 * Changes the visible application screen.
 * @param screen - The screen that should be visible.
 * @returns Nothing.
 */
function showScreen(screen: Screen): void {
  if (!HOME_SCREEN || !SETTINGS_SCREEN || !GAME_SCREEN) return;
  if (screen !== "game") cancelComparison();
  if (SETTINGS_HEADER) SETTINGS_HEADER.hidden = screen !== "settings";
  HOME_SCREEN.hidden = screen !== "home";
  SETTINGS_SCREEN.hidden = screen !== "settings";
  GAME_SCREEN.hidden = screen !== "game";
}

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

/**
 * Creates one face-down memory card.
 * @param motif - The image and label used by the card.
 * @param pairIndex - The number shared by both cards in one pair.
 * @param copyName - The name that makes each card ID unique.
 * @returns A new memory card.
 */
function createCard(motif: CardMotif, pairIndex: number, copyName: string): MemoryCard {
  return {
    id: `${pairIndex}-${copyName}`,
    pairId: String(pairIndex),
    motif: motif.value,
    label: motif.label,
    isFlipped: false,
    isMatched: false,
  };
}

/**
 * Creates two cards that use the same motif.
 * @param motif - The image and label used by both cards.
 * @param pairIndex - The number shared by both cards.
 * @returns Two separate cards that form one pair.
 */
function createPair(motif: CardMotif, pairIndex: number): MemoryCard[] {
  return [createCard(motif, pairIndex, "a"), createCard(motif, pairIndex, "b")];
}

/**
 * Creates and shuffles the deck for one round.
 * @param settings - The selected theme and board size.
 * @returns A shuffled deck with the required number of pairs.
 */
function createDeck(settings: GameSettings): MemoryCard[] {
  const PAIR_COUNT: number = PAIR_COUNTS[settings.boardSize];
  const MOTIFS: CardMotif[] = getMotifs(settings.theme).slice(0, PAIR_COUNT);
  const CARDS: MemoryCard[] = [];
  for (let index: number = 0; index < MOTIFS.length; index += 1) {
    CARDS.push(...createPair(MOTIFS[index], index));
  }
  return shuffleCards(CARDS);
}

/**
 * Adds a card image to the front of a card button.
 * @param button - The card button rendered in the board.
 * @param card - The data belonging to the button.
 * @returns Nothing.
 */
function renderMotif(button: HTMLButtonElement, card: MemoryCard): void {
  const FRONT: HTMLElement | null = button.querySelector(".memory-card__front");
  if (!FRONT) return;
  const IMAGE: HTMLImageElement = document.createElement("img");
  IMAGE.src = card.motif;
  IMAGE.alt = card.label;
  FRONT.append(IMAGE);
}

/**
 * Clones and appends one card button.
 * @param card - The card data to render.
 * @returns Nothing.
 */
function appendCard(card: MemoryCard): void {
  const BUTTON: HTMLButtonElement | null = CARD_TEMPLATE?.content.querySelector("button") ?? null;
  if (!BUTTON || !GAME_BOARD) return;
  const CLONE: Node = BUTTON.cloneNode(true);
  if (!(CLONE instanceof HTMLButtonElement)) return;
  CLONE.dataset.cardId = card.id;
  renderMotif(CLONE, card);
  GAME_BOARD.append(CLONE);
}

/**
 * Builds a new board for the selected settings.
 * @param settings - The settings used to create and style the board.
 * @returns Nothing.
 */
function renderBoard(settings: GameSettings): void {
  if (!GAME_BOARD) return;
  deck = createDeck(settings);
  GAME_BOARD.style.setProperty("--board-columns", String(BOARD_COLUMNS[settings.boardSize]));
  applyAppearance(GAME_SCREEN, settings);
  GAME_BOARD.replaceChildren();
  for (const CARD of deck) appendCard(CARD);
  updateStatus();
}

/**
 * Updates the current player and both scores.
 * @returns Nothing.
 */
function updateStatus(): void {
  if (CURRENT_PLAYER) {
    CURRENT_PLAYER.className = `score--${activePlayer}`;
    const LABEL: HTMLElement | null = CURRENT_PLAYER.querySelector("span");
    if (LABEL) LABEL.textContent = activePlayer === "blue" ? "Blue" : "Orange";
  }
  if (BLUE_SCORE) BLUE_SCORE.textContent = String(scores.blue);
  if (ORANGE_SCORE) ORANGE_SCORE.textContent = String(scores.orange);
}

/**
 * Stops a pending card comparison.
 * @returns Nothing.
 */
function cancelComparison(): void {
  if (comparisonTimer === null) return;
  window.clearTimeout(comparisonTimer);
  comparisonTimer = null;
}

/**
 * Resets the changing values for a new round.
 * @param startingPlayer - The player who begins the new round.
 * @returns Nothing.
 */
function resetGameState(startingPlayer: PlayerColor): void {
  cancelComparison();
  flippedCards = [];
  activePlayer = startingPlayer;
  scores = { blue: 0, orange: 0 };
  boardLocked = false;
  exitDialogOpen = false;
  if (RESULT_OVERLAY) RESULT_OVERLAY.hidden = true;
}

/**
 * Writes the winner or draw text into the result dialog.
 * @returns Nothing.
 */
function updateResultText(): void {
  const IS_DRAW: boolean = scores.blue === scores.orange;
  const WINNER: string = scores.blue > scores.orange ? "Blue" : "Orange";
  if (RESULT_TITLE) RESULT_TITLE.textContent = IS_DRAW ? "It’s a draw!" : `${WINNER} wins!`;
  if (!RESULT_MESSAGE) return;
  RESULT_MESSAGE.textContent = IS_DRAW
    ? "Ihr habt gleich viele Paare gefunden."
    : `${WINNER} hat die meisten Paare gefunden.`;
}

/**
 * Ends the round and shows the final scores.
 * @returns Nothing.
 */
function finishGame(): void {
  boardLocked = true;
  updateResultText();
  if (FINAL_BLUE_SCORE) FINAL_BLUE_SCORE.textContent = String(scores.blue);
  if (FINAL_ORANGE_SCORE) FINAL_ORANGE_SCORE.textContent = String(scores.orange);
  if (RESULT_OVERLAY) RESULT_OVERLAY.hidden = false;
  NEW_ROUND_BUTTON?.focus();
}

/**
 * Finds the button that belongs to one card.
 * @param card - The card to find in the board.
 * @returns The card button or null when it is not rendered.
 */
function getCardElement(card: MemoryCard): HTMLButtonElement | null {
  return GAME_BOARD?.querySelector<HTMLButtonElement>(`[data-card-id="${card.id}"]`) ?? null;
}

/**
 * Turns one card face up.
 * @param card - The card to reveal.
 * @returns Nothing.
 */
function flipCard(card: MemoryCard): void {
  card.isFlipped = true;
  const ELEMENT: HTMLButtonElement | null = getCardElement(card);
  ELEMENT?.classList.add("memory-card--flipped");
  ELEMENT?.setAttribute("aria-label", `Aufgedeckte Memory-Karte: ${card.label}`);
}

/**
 * Turns one unmatched card face down.
 * @param card - The card to hide.
 * @returns Nothing.
 */
function hideCard(card: MemoryCard): void {
  card.isFlipped = false;
  const ELEMENT: HTMLButtonElement | null = getCardElement(card);
  ELEMENT?.classList.remove("memory-card--flipped");
  ELEMENT?.setAttribute("aria-label", "Verdeckte Memory-Karte");
}

/**
 * Marks one card as part of a found pair.
 * @param card - The card that has been matched.
 * @returns Nothing.
 */
function markCard(card: MemoryCard): void {
  card.isMatched = true;
  const ELEMENT: HTMLButtonElement | null = getCardElement(card);
  ELEMENT?.classList.add("memory-card--matched");
  ELEMENT?.setAttribute("aria-label", `Gefundenes Kartenpaar: ${card.label}`);
  if (ELEMENT) ELEMENT.disabled = true;
}

/**
 * Awards a point for two matching cards.
 * @returns Nothing.
 */
function resolveMatch(): void {
  comparisonTimer = null;
  for (const CARD of flippedCards) markCard(CARD);
  scores[activePlayer] += 1;
  flippedCards = [];
  boardLocked = false;
  updateStatus();
  if (deck.every((card: MemoryCard): boolean => card.isMatched)) finishGame();
}

/**
 * Hides two different cards and changes the active player.
 * @returns Nothing.
 */
function resolveMismatch(): void {
  comparisonTimer = null;
  for (const CARD of flippedCards) hideCard(CARD);
  flippedCards = [];
  activePlayer = activePlayer === "blue" ? "orange" : "blue";
  boardLocked = false;
  updateStatus();
}

/**
 * Schedules the result of the current card comparison.
 * @returns Nothing.
 */
function compareFlippedCards(): void {
  const FIRST_CARD: MemoryCard | undefined = flippedCards[0];
  const SECOND_CARD: MemoryCard | undefined = flippedCards[1];
  if (!FIRST_CARD || !SECOND_CARD) return;
  boardLocked = true;
  const IS_MATCH: boolean = FIRST_CARD.pairId === SECOND_CARD.pairId;
  const DELAY: number = IS_MATCH ? MATCH_DELAY_MS : MISMATCH_DELAY_MS;
  comparisonTimer = window.setTimeout(IS_MATCH ? resolveMatch : resolveMismatch, DELAY);
}

/**
 * Reveals one valid card and starts comparison after the second card.
 * @param cardId - The unique ID of the selected card.
 * @returns Nothing.
 */
function handleCardClick(cardId: string): void {
  if (boardLocked || exitDialogOpen) return;
  const CARD: MemoryCard | undefined = deck.find((item: MemoryCard): boolean => item.id === cardId);
  if (!CARD || CARD.isFlipped || CARD.isMatched) return;
  flipCard(CARD);
  flippedCards.push(CARD);
  if (flippedCards.length === CARDS_PER_PAIR) compareFlippedCards();
}

/**
 * Starts a fresh round with the stored settings.
 * @returns Nothing.
 */
function startRound(): void {
  if (!gameSettings) return;
  EXIT_DIALOG?.close();
  resetGameState(gameSettings.player);
  renderBoard(gameSettings);
  showScreen("game");
}

/**
 * Starts a round after validating the settings form.
 * @param event - The settings form submit event.
 * @returns Nothing.
 */
function handleSettingsSubmit(event: SubmitEvent): void {
  event.preventDefault();
  gameSettings = readSettings();
  if (SETTINGS_FEEDBACK) {
    SETTINGS_FEEDBACK.textContent = gameSettings ? "" : "Bitte wähle in jeder Gruppe eine gültige Option.";
  }
  startRound();
}

/**
 * Finds the card button that received a board click.
 * @param event - The click event from the game board.
 * @returns Nothing.
 */
function handleBoardClick(event: MouseEvent): void {
  if (!(event.target instanceof Element)) return;
  const ELEMENT: HTMLButtonElement | null = event.target.closest(".memory-card");
  const CARD_ID: string | undefined = ELEMENT?.dataset.cardId;
  if (CARD_ID) handleCardClick(CARD_ID);
}

/**
 * Opens the settings screen and refreshes its preview.
 * @returns Nothing.
 */
function openSettings(): void {
  updatePreview();
  showScreen("settings");
}

/**
 * Opens the confirmation dialog before leaving a round.
 * @returns Nothing.
 */
function openExitDialog(): void {
  if (!EXIT_DIALOG) return;
  exitDialogOpen = true;
  EXIT_DIALOG.showModal();
}

/**
 * Closes the exit dialog and continues the same round.
 * @returns Nothing.
 */
function continueGame(): void {
  exitDialogOpen = false;
  EXIT_DIALOG?.close();
  EXIT_BUTTON?.focus();
}

/**
 * Ends the active round and returns to the settings.
 * @returns Nothing.
 */
function confirmExit(): void {
  exitDialogOpen = false;
  EXIT_DIALOG?.close();
  updatePreview();
  showScreen("settings");
}

/**
 * Returns to the home screen.
 * @returns Nothing.
 */
function returnHome(): void {
  showScreen("home");
}

/**
 * Temporarily previews the theme stored on a settings label.
 * @param event - The pointer or focus event from a theme label.
 * @returns Nothing.
 */
function previewTheme(event: Event): void {
  if (!(event.currentTarget instanceof HTMLElement)) return;
  const THEME_NAME: string | undefined = event.currentTarget.dataset.previewTheme;
  if (THEME_NAME === "code-vibes" || THEME_NAME === "gaming") updatePreview(THEME_NAME);
  if (THEME_NAME === "da-projects" || THEME_NAME === "food") updatePreview(THEME_NAME);
}

/**
 * Connects hover and keyboard preview events to all theme labels.
 * @returns Nothing.
 */
function registerThemePreviewEvents(): void {
  const LABELS: NodeListOf<HTMLElement> = document.querySelectorAll("[data-preview-theme]");
  for (const LABEL of LABELS) {
    LABEL.addEventListener("mouseenter", previewTheme);
    LABEL.addEventListener("mouseleave", (): void => updatePreview());
    LABEL.addEventListener("focusin", previewTheme);
    LABEL.addEventListener("focusout", (): void => updatePreview());
  }
}

/**
 * Connects the navigation, form, dialog, and game controls.
 * @returns Nothing.
 */
function registerEvents(): void {
  PLAY_BUTTON?.addEventListener("click", openSettings);
  BACK_BUTTON?.addEventListener("click", returnHome);
  SETTINGS_FORM?.addEventListener("submit", handleSettingsSubmit);
  SETTINGS_FORM?.addEventListener("change", (): void => updatePreview());
  EXIT_BUTTON?.addEventListener("click", openExitDialog);
  BACK_TO_GAME_BUTTON?.addEventListener("click", continueGame);
  CONFIRM_EXIT_BUTTON?.addEventListener("click", confirmExit);
  EXIT_DIALOG?.addEventListener("cancel", continueGame);
  NEW_ROUND_BUTTON?.addEventListener("click", startRound);
  RESULT_HOME_BUTTON?.addEventListener("click", returnHome);
  GAME_BOARD?.addEventListener("click", handleBoardClick);
  registerThemePreviewEvents();
}

registerEvents();
