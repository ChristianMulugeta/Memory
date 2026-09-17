import type { BoardSize, CardMotif, Theme } from "./game-types";

export const MATCH_DELAY_MS: number = 450;
export const MISMATCH_DELAY_MS: number = 900;
export const CARDS_PER_PAIR: number = 2;

export const PAIR_COUNTS: Record<BoardSize, number> = {
  "4x4": 8,
  "4x6": 12,
  "6x6": 18,
};

export const BOARD_COLUMNS: Record<BoardSize, number> = {
  "4x4": 4,
  "4x6": 4,
  "6x6": 6,
};

const CODE_VIBES_FILES: string[] = [
  "firebase", "vuejs", "mysql", "react", "bootstrap", "nodejs",
  "github", "sass", "bash", "angularjs", "django", "css3",
  "vscode", "html5", "javascript", "typescript", "git", "python",
];

const GAMING_FILES: string[] = [
  "guard-circle", "guard-square", "guard-triangle", "maze", "creeper", "mushroom",
  "dice", "banana", "controller", "ghosts", "pacman", "star",
  "gameboy", "snake", "puzzle", "level-up", "playing-card", "play",
];

const DA_PROJECT_FILES: string[] = [
  "ramen-bowl", "ramen-bowl-empty", "eggs", "sakura-flower", "join-wordmark",
  "chef-hat", "join-logo-green", "shopping-basket", "pokeball", "tic-tac-toe",
  "smiley", "join-logo-gradient", "chat", "sombrero", "broccoli", "user-network",
  "wave", "currency-exchange",
];

const FOOD_FILES: string[] = [
  "fries", "burger", "donut", "wrap", "cake", "pizza",
  "pretzel", "sushi", "taco", "salad", "pudding", "sandwich",
  "nuggets", "cupcake", "corndog", "icecream", "macarons", "chocolate",
];

/**
 * Converts a file name into readable alternative text.
 * @param fileName - The file name without its extension.
 * @returns A readable name for the card image.
 */
function createLabel(fileName: string): string {
  const WORDS: string[] = fileName.split("-");
  const LABEL: string = WORDS.join(" ");
  return LABEL.charAt(0).toUpperCase() + LABEL.slice(1);
}

/**
 * Creates image data for one theme.
 * @param theme - The folder that contains the card images.
 * @param fileNames - The image file names without extensions.
 * @returns All card motifs for the selected theme.
 */
function createMotifs(theme: Theme, fileNames: string[]): CardMotif[] {
  const MOTIFS: CardMotif[] = [];

  for (const FILE_NAME of fileNames) {
    MOTIFS.push({
      value: `./assets/cards/${theme}/${FILE_NAME}.png`,
      label: createLabel(FILE_NAME),
    });
  }

  return MOTIFS;
}

/**
 * Returns the available card images for one theme.
 * @param theme - The theme selected in the settings.
 * @returns The available card motifs for that theme.
 */
export function getMotifs(theme: Theme): CardMotif[] {
  if (theme === "code-vibes") return createMotifs(theme, CODE_VIBES_FILES);
  if (theme === "gaming") return createMotifs(theme, GAMING_FILES);
  if (theme === "food") return createMotifs(theme, FOOD_FILES);
  return createMotifs(theme, DA_PROJECT_FILES);
}
