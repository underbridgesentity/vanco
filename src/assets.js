/* Central asset registry — Vite fingerprints these imports and returns final URLs,
   so references work under any deploy base path. */
import monoWhite from "./assets/mono-white.png";
import monoBlack from "./assets/mono-black.png";
import wordWhite from "./assets/word-white.png";
import wordBlack from "./assets/word-black.png";
import portraitBlue from "./assets/portrait-blue.png";
import portraitHat from "./assets/portrait-hat.jpg";

export const ASSETS = {
  monoW: monoWhite,
  monoB: monoBlack,
  wordW: wordWhite,
  wordB: wordBlack,
  blue: portraitBlue,
  hat: portraitHat,
};

export const HERO_IMG = {
  "Blue (cinematic)": portraitBlue,
  "Studio (editorial)": portraitHat,
};
