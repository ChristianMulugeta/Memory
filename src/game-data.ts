import type { BoardSize, CardMotif, Layout, PlayerColor, Theme } from "./game-types";

export const THEMES: Theme[] = ["code-vibes", "gaming", "da-projects", "food"];
export const PLAYERS: PlayerColor[] = ["blue", "orange"];
export const BOARD_SIZES: BoardSize[] = ["4x4", "4x6", "6x6"];
export const LAYOUTS: Layout[] = ["light", "dark"];
export const MATCH_DELAY_MS: number = 450;
export const MISMATCH_DELAY_MS: number = 900;
export const CARDS_PER_PAIR: number = 2;
export const PAIR_COUNTS: Record<BoardSize, number> = { "4x4": 8, "4x6": 12, "6x6": 18 };
export const BOARD_COLUMNS: Record<BoardSize, number> = { "4x4": 4, "4x6": 4, "6x6": 6 };
const DA_PROJECT_ENTRIES: [string, string][] = [
  ["wave", "Welle"], ["user-network", "Benutzernetzwerk"],
  ["tic-tac-toe", "Tic-Tac-Toe"], ["sombrero", "Sombrero"], ["smiley", "Smiley"],
  ["shopping-basket", "Einkaufskorb"], ["sakura-flower-small", "Kleine Kirschblüte"],
  ["sakura-flower-large", "Große Kirschblüte"], ["ramen-bowl", "Ramen-Schüssel"],
  ["ramen-bowl-empty", "Leere Ramen-Schüssel"], ["pokeball", "Pokéball"],
  ["join-wordmark", "Join-Schriftzug"], ["join-logo-green", "Grünes Join-Logo"],
  ["join-logo-gradient", "Join-Logo mit Farbverlauf"], ["eggs", "Eier"],
  ["currency-exchange", "Währungswechsel"], ["chef-hat", "Kochmütze"],
  ["chat", "Chat"], ["broccoli", "Brokkoli"],
];

export const THEME_MOTIFS: Record<Theme, string> = {
  "code-vibes": "💻", gaming: "🎲", "da-projects": "🌊", food: "🍜",
};

const EMOJI_ENTRIES: Record<Exclude<Theme, "da-projects">, [string, string][]> = {
  "code-vibes": [
    ["💻", "Laptop"], ["⌨️", "Tastatur"], ["🖱️", "Computermaus"],
    ["🧑‍💻", "Programmierer"], ["⚙️", "Zahnrad"], ["🧠", "Gehirn"],
    ["🚀", "Rakete"], ["📱", "Smartphone"], ["🔧", "Schraubenschlüssel"],
    ["🧩", "Puzzleteil"], ["📡", "Satellitenschüssel"], ["💾", "Diskette"],
    ["🤖", "Roboter"], ["🌐", "Globus"], ["🔋", "Batterie"],
    ["🖥️", "Monitor"], ["📊", "Balkendiagramm"], ["🔐", "Schloss mit Schlüssel"],
  ],
  gaming: [
    ["🎲", "Würfel"], ["🎮", "Controller"], ["👾", "Pixel-Alien"],
    ["🕹️", "Joystick"], ["🏆", "Pokal"], ["♟️", "Schachfigur"],
    ["🎯", "Zielscheibe"], ["🧙", "Zauberer"], ["🐉", "Drache"],
    ["⚔️", "Gekreuzte Schwerter"], ["🏎️", "Rennwagen"], ["🎳", "Bowling"],
    ["🧟", "Zombie"], ["💎", "Diamant"], ["🛡️", "Schild"],
    ["🏁", "Zielflagge"], ["🃏", "Joker"], ["🎰", "Spielautomat"],
  ],
  food: [
    ["🍜", "Nudelsuppe"], ["🍕", "Pizza"], ["🥦", "Brokkoli"],
    ["🍳", "Spiegelei"], ["🍣", "Sushi"], ["🍔", "Burger"],
    ["🌮", "Taco"], ["🍓", "Erdbeere"], ["🥐", "Croissant"],
    ["🍩", "Donut"], ["🥑", "Avocado"], ["🍇", "Trauben"],
    ["🧀", "Käse"], ["🥕", "Karotte"], ["🍪", "Keks"],
    ["🍉", "Wassermelone"], ["🥨", "Brezel"], ["🍒", "Kirschen"],
  ],
};

/** Liefert Motive und verständliche Beschriftungen für das gewählte Theme. */
export function getMotifs(theme: Theme): CardMotif[] {
  if (theme === "da-projects") return DA_PROJECT_ENTRIES.map(createImageMotif);
  return EMOJI_ENTRIES[theme].map(createEmojiMotif);
}

/** Ergänzt den öffentlichen Bildpfad eines DA-Projects-Motivs. */
function createImageMotif([name, label]: [string, string]): CardMotif {
  return { value: `/assets/cards/da-projects/${name}.png`, label };
}

/** Wandelt einen Emoji-Eintrag in ein beschriftetes Kartenmotiv um. */
function createEmojiMotif([value, label]: [string, string]): CardMotif {
  return { value, label };
}
