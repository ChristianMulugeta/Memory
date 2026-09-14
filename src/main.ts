import "../scss/main.scss";

const homeScreen = document.querySelector<HTMLElement>("#home-screen");
const settingsScreen = document.querySelector<HTMLElement>("#settings-screen");
const gameScreen = document.querySelector<HTMLElement>("#game-screen");
const playButton = document.querySelector<HTMLButtonElement>("#play-button");
const backButton = document.querySelector<HTMLButtonElement>("#back-button");
const settingsForm = document.querySelector<HTMLFormElement>("#settings-form");
const settingsFeedback = document.querySelector<HTMLElement>("#settings-feedback");
const settingsPreview = document.querySelector<HTMLElement>("#settings-preview");
const previewMotif = document.querySelector<HTMLElement>("#preview-motif");
const previewPlayer = document.querySelector<HTMLElement>("#preview-player");
const gameBoard = document.querySelector<HTMLElement>("#game-board");
const exitButton = document.querySelector<HTMLButtonElement>("#exit-button");
const currentPlayer = document.querySelector<HTMLElement>("#current-player");
const blueScore = document.querySelector<HTMLElement>("#blue-score");
const orangeScore = document.querySelector<HTMLElement>("#orange-score");
const resultOverlay = document.querySelector<HTMLElement>("#result-overlay");
const resultTitle = document.querySelector<HTMLElement>("#result-title");
const resultMessage = document.querySelector<HTMLElement>("#result-message");
const finalBlueScore = document.querySelector<HTMLElement>("#final-blue-score");
const finalOrangeScore = document.querySelector<HTMLElement>("#final-orange-score");
const newRoundButton = document.querySelector<HTMLButtonElement>("#new-round-button");
const resultHomeButton = document.querySelector<HTMLButtonElement>("#result-home-button");

type Theme = "code-vibes" | "gaming" | "da-projects" | "food";
type PlayerColor = "blue" | "orange";
type BoardSize = "4x4" | "4x6" | "6x6";
type Layout = "light" | "dark";

interface GameSettings {
  theme: Theme;
  player: PlayerColor;
  boardSize: BoardSize;
  layout: Layout;
}

interface MemoryCard {
  id: string;
  pairId: string;
  motif: string;
  isImage: boolean;
  isFlipped: boolean;
  isMatched: boolean;
}

let gameSettings: GameSettings | null = null;
let deck: MemoryCard[] = [];
let flippedCards: MemoryCard[] = [];
let activePlayer: PlayerColor = "blue";
let scores: Record<PlayerColor, number> = { blue: 0, orange: 0 };
let boardLocked = false;

const themeMotifs: Record<Theme, string> = {
  "code-vibes": "💻",
  gaming: "🎲",
  "da-projects": "🌊",
  food: "🍜",
};

const daProjectMotifs = [
  "wave", "user-network", "tic-tac-toe", "sombrero", "smiley",
  "shopping-basket", "sakura-flower-small", "sakura-flower-large",
  "ramen-bowl", "ramen-bowl-empty", "pokeball", "join-wordmark",
  "join-logo-green", "join-logo-gradient", "eggs", "currency-exchange",
  "chef-hat", "chat", "broccoli",
].map((name) => `/assets/cards/da-projects/${name}.png`);

const emojiMotifs: Record<Exclude<Theme, "da-projects">, string[]> = {
  "code-vibes": ["💻", "⌨️", "🖱️", "🧑‍💻", "⚙️", "🧠", "🚀", "📱", "🔧", "🧩", "📡", "💾", "🤖", "🌐", "🔋", "🖥️", "📊", "🔐"],
  gaming: ["🎲", "🎮", "👾", "🕹️", "🏆", "♟️", "🎯", "🧙", "🐉", "⚔️", "🏎️", "🎳", "🧟", "💎", "🛡️", "🏁", "🃏", "🎰"],
  food: ["🍜", "🍕", "🥦", "🍳", "🍣", "🍔", "🌮", "🍓", "🥐", "🍩", "🥑", "🍇", "🧀", "🥕", "🍪", "🍉", "🥨", "🍒"],
};

const pairCounts: Record<BoardSize, number> = {
  "4x4": 8,
  "4x6": 12,
  "6x6": 18,
};

function readSettings(): GameSettings {
  const formData = new FormData(settingsForm ?? undefined);

  return {
    theme: formData.get("theme") as Theme,
    player: formData.get("player") as PlayerColor,
    boardSize: formData.get("boardSize") as BoardSize,
    layout: formData.get("layout") as Layout,
  };
}

function updatePreview(): void {
  const settings = readSettings();

  if (settingsPreview) {
    settingsPreview.dataset.layout = settings.layout;
    settingsPreview.dataset.theme = settings.theme;
  }

  if (previewMotif) {
    previewMotif.textContent = themeMotifs[settings.theme];
  }

  if (previewPlayer) {
    previewPlayer.className = `preview-player preview-player--${settings.player}`;
  }
}

function showScreen(screen: "home" | "settings" | "game"): void {
  if (!homeScreen || !settingsScreen || !gameScreen) return;

  homeScreen.hidden = screen !== "home";
  settingsScreen.hidden = screen !== "settings";
  gameScreen.hidden = screen !== "game";
}

function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
}

function createDeck(settings: GameSettings): MemoryCard[] {
  const motifPool = settings.theme === "da-projects"
    ? daProjectMotifs
    : emojiMotifs[settings.theme];
  const selectedMotifs = motifPool.slice(0, pairCounts[settings.boardSize]);

  const deck = selectedMotifs.flatMap((motif, pairIndex) =>
    ["a", "b"].map((copy) => ({
      id: `${pairIndex}-${copy}`,
      pairId: String(pairIndex),
      motif,
      isImage: settings.theme === "da-projects",
      isFlipped: false,
      isMatched: false,
    })),
  );

  return shuffle(deck);
}

function renderBoard(settings: GameSettings): void {
  if (!gameBoard) return;

  deck = createDeck(settings);
  const columns = settings.boardSize === "6x6" ? 6 : 4;
  gameBoard.style.setProperty("--board-columns", String(columns));
  if (gameScreen) {
    gameScreen.dataset.layout = settings.layout;
    gameScreen.dataset.theme = settings.theme;
  }
  gameBoard.replaceChildren();

  deck.forEach((card) => {
    const button = document.createElement("button");
    button.className = "memory-card";
    button.type = "button";
    button.dataset.cardId = card.id;
    button.setAttribute("aria-label", "Verdeckte Memory-Karte");

    const motif = card.isImage
      ? `<img src="${card.motif}" alt="" />`
      : `<span>${card.motif}</span>`;

    button.innerHTML = `<span class="memory-card__inner"><span class="memory-card__back">&lt;/&gt;</span><span class="memory-card__front">${motif}</span></span>`;
    gameBoard.append(button);
  });

  updateStatus();
}

function updateStatus(): void {
  if (currentPlayer) {
    currentPlayer.textContent = activePlayer === "blue" ? "Blue" : "Orange";
    currentPlayer.className = `score--${activePlayer}`;
  }

  if (blueScore) blueScore.textContent = String(scores.blue);
  if (orangeScore) orangeScore.textContent = String(scores.orange);
}

function resetGameState(startingPlayer: PlayerColor): void {
  flippedCards = [];
  activePlayer = startingPlayer;
  scores = { blue: 0, orange: 0 };
  boardLocked = false;
  if (resultOverlay) resultOverlay.hidden = true;
}

function finishGame(): void {
  boardLocked = true;
  const isDraw = scores.blue === scores.orange;
  const winner = scores.blue > scores.orange ? "Blue" : "Orange";

  if (resultTitle) resultTitle.textContent = isDraw ? "It’s a draw!" : `${winner} wins!`;
  if (resultMessage) {
    resultMessage.textContent = isDraw
      ? "Ihr habt gleich viele Paare gefunden."
      : `${winner} hat die meisten Paare gefunden.`;
  }
  if (finalBlueScore) finalBlueScore.textContent = String(scores.blue);
  if (finalOrangeScore) finalOrangeScore.textContent = String(scores.orange);
  if (resultOverlay) resultOverlay.hidden = false;
  newRoundButton?.focus();
}

function getCardElement(card: MemoryCard): HTMLButtonElement | null {
  return gameBoard?.querySelector<HTMLButtonElement>(`[data-card-id="${card.id}"]`) ?? null;
}

function flipCard(card: MemoryCard): void {
  card.isFlipped = true;
  const cardElement = getCardElement(card);
  cardElement?.classList.add("memory-card--flipped");
  cardElement?.setAttribute("aria-label", "Aufgedeckte Memory-Karte");
}

function hideCards(cards: MemoryCard[]): void {
  cards.forEach((card) => {
    card.isFlipped = false;
    const cardElement = getCardElement(card);
    cardElement?.classList.remove("memory-card--flipped");
    cardElement?.setAttribute("aria-label", "Verdeckte Memory-Karte");
  });
}

function markPair(cards: MemoryCard[]): void {
  cards.forEach((card) => {
    card.isMatched = true;
    const cardElement = getCardElement(card);
    cardElement?.classList.add("memory-card--matched");
    cardElement?.setAttribute("aria-label", "Gefundenes Kartenpaar");
    if (cardElement) cardElement.disabled = true;
  });
}

function compareFlippedCards(): void {
  const [firstCard, secondCard] = flippedCards;
  if (!firstCard || !secondCard) return;

  boardLocked = true;

  if (firstCard.pairId === secondCard.pairId) {
    window.setTimeout(() => {
      markPair(flippedCards);
      scores[activePlayer] += 1;
      flippedCards = [];
      boardLocked = false;
      updateStatus();
      if (deck.every((card) => card.isMatched)) finishGame();
    }, 450);
    return;
  }

  window.setTimeout(() => {
    hideCards(flippedCards);
    flippedCards = [];
    activePlayer = activePlayer === "blue" ? "orange" : "blue";
    boardLocked = false;
    updateStatus();
  }, 900);
}

function handleCardClick(cardId: string): void {
  if (boardLocked) return;

  const card = deck.find((item) => item.id === cardId);
  if (!card || card.isFlipped || card.isMatched) return;

  flipCard(card);
  flippedCards.push(card);

  if (flippedCards.length === 2) compareFlippedCards();
}

playButton?.addEventListener("click", () => showScreen("settings"));
backButton?.addEventListener("click", () => showScreen("home"));

settingsForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  gameSettings = readSettings();
  resetGameState(gameSettings.player);

  if (settingsFeedback) {
    settingsFeedback.textContent = `Auswahl gespeichert: ${gameSettings.boardSize}, ${gameSettings.theme}, ${gameSettings.layout}.`;
  }

  renderBoard(gameSettings);
  showScreen("game");
});

settingsForm?.addEventListener("change", updatePreview);
exitButton?.addEventListener("click", () => showScreen("home"));
newRoundButton?.addEventListener("click", () => {
  if (!gameSettings) return;
  resetGameState(gameSettings.player);
  renderBoard(gameSettings);
});
resultHomeButton?.addEventListener("click", () => showScreen("home"));

gameBoard?.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;
  const cardElement = target.closest<HTMLButtonElement>(".memory-card");
  const cardId = cardElement?.dataset.cardId;

  if (cardId) handleCardClick(cardId);
});
