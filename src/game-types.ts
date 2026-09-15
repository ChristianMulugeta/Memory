export type Theme = "code-vibes" | "gaming" | "da-projects" | "food";
export type PlayerColor = "blue" | "orange";
export type BoardSize = "4x4" | "4x6" | "6x6";
export type Layout = "light" | "dark";
export type Screen = "home" | "settings" | "game";

export interface GameSettings {
  theme: Theme;
  player: PlayerColor;
  boardSize: BoardSize;
  layout: Layout;
}

export interface CardMotif {
  value: string;
  label: string;
}

export interface MemoryCard {
  id: string;
  pairId: string;
  motif: string;
  label: string;
  isImage: boolean;
  isFlipped: boolean;
  isMatched: boolean;
}
