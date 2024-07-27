import * as Tone from "tone";

export const MELODY_LENGTH_MS = 1000;

const melodyPlayer = new Tone.Synth();
melodyPlayer.toDestination();

const gameOver = () => {
  const now = Tone.now();
  melodyPlayer.triggerAttackRelease("C4", "8n", now);
  melodyPlayer.triggerAttackRelease("G3", "8n", now + 0.25);
  melodyPlayer.triggerAttackRelease("E3", "8n", now + 0.5);
  melodyPlayer.triggerAttackRelease("C3", "4n", now + 0.75);
};

const highScore = () => {
  const now = Tone.now();
  melodyPlayer.triggerAttackRelease("C4", "16n", now);
  melodyPlayer.triggerAttackRelease("E4", "16n", now + 0.125);
  melodyPlayer.triggerAttackRelease("G4", "16n", now + 0.25);
  melodyPlayer.triggerAttackRelease("C5", "8n", now + 0.375);
  melodyPlayer.triggerAttackRelease("G4", "8n", now + 0.5);
  melodyPlayer.triggerAttackRelease("C5", "4n", now + 0.75);
};

export const melodies = { gameOver, highScore };
