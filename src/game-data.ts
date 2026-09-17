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
  "angularjs", "bash", "bootstrap", "css3", "django", "firebase",
  "git", "github", "html5", "javascript", "mysql", "nodejs",
  "python", "react", "sass", "typescript", "vscode", "vuejs",
];

const GAMING_FILES: string[] = [
  "banana", "card", "chip", "controller", "creeper", "dice",
  "gameboy", "guard-circle", "guard-square", "guard-triangle", "handheld",
  "lego", "mushroom", "pacman", "play", "purple-controller", "puzzle", "star",
];

const DA_PROJECT_FILES: string[] = [
  "wave", "user-network", "tic-tac-toe", "sombrero", "smiley", "shopping-basket",
  "sakura-flower-small", "sakura-flower-large", "ramen-bowl", "ramen-bowl-empty",
  "pokeball", "join-wordmark", "join-logo-green", "join-logo-gradient", "eggs",
  "currency-exchange", "chef-hat", "chat", "broccoli",
];

const FOOD_FILES: string[] = [
  "burger", "cake", "chocolate", "corndog", "cupcake", "donut",
  "fries", "icecream", "macarons", "nuggets", "pizza", "pretzel",
  "pudding", "salad", "sandwich", "sushi", "taco", "wrap",
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
 * @param extension - The file extension used by this theme.
 * @returns All card motifs for the selected theme.
 */
function createMotifs(theme: Theme, fileNames: string[], extension: string): CardMotif[] {
  const MOTIFS: CardMotif[] = [];

  for (const FILE_NAME of fileNames) {
    MOTIFS.push({
      value: `./assets/cards/${theme}/${FILE_NAME}.${extension}`,
      label: createLabel(FILE_NAME),
    });
  }

  return MOTIFS;
}

/**
 * Returns the original card images for one theme.
 * @param theme - The theme selected in the settings.
 * @returns The available card motifs for that theme.
 */
export function getMotifs(theme: Theme): CardMotif[] {
  if (theme === "code-vibes") return createMotifs(theme, CODE_VIBES_FILES, "svg");
  if (theme === "gaming") return createMotifs(theme, GAMING_FILES, "svg");
  if (theme === "food") return createMotifs(theme, FOOD_FILES, "svg");
  return createMotifs(theme, DA_PROJECT_FILES, "png");
}
