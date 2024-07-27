export const MELODY_LENGTH_MS = 1000;

const gameOver = [
  { note: "C4", duration: "8n", offset: 0 },
  { note: "G3", duration: "8n", offset: 0.25 },
  { note: "E3", duration: "8n", offset: 0.5 },
  { note: "C3", duration: "4n", offset: 0.75 },
];

const highScore = [
  { note: "C4", duration: "16n", offset: 0 },
  { note: "E4", duration: "16n", offset: 0.125 },
  { note: "G4", duration: "16n", offset: 0.25 },
  { note: "C5", duration: "8n", offset: 0.375 },
  { note: "G4", duration: "8n", offset: 0.5 },
  { note: "C5", duration: "4n", offset: 0.75 },
];

export const melodies = { gameOver, highScore };
