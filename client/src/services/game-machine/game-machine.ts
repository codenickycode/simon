import { useEffect, useState } from "react";
import { PadTone } from "../../types/pad";
import { sequencer, TIMING_BUFFER_MS } from "../sequencer";

const GAME_OVER_DISPLAY_MS = 2000;

export type GameState =
  | "idle"
  | "playing:computer"
  | "playing:user"
  | "gameOver";

export const useGameMachine = () => {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [seqIndex, setSeqIndex] = useState(0);

  if (
    seqIndex &&
    seqIndex === sequencer.length() &&
    gameState !== "playing:computer"
  ) {
    setGameState("playing:computer");
  }

  useEffect(() => {
    if (gameState !== "playing:computer") {
      return;
    }
    (async () => {
      sequencer.addRandomNoteToSequence();
      // a short delay before playing the sequence
      await new Promise((res) => setTimeout(res, TIMING_BUFFER_MS));
      await sequencer.playSequence();
      setSeqIndex(0);
      setGameState("playing:user");
    })();
  }, [gameState]);

  useEffect(() => {
    if (gameState !== "gameOver") {
      return;
    }
    (async () => {
      // display game over screen for a time, then return to idle state
      await new Promise((res) => setTimeout(res, GAME_OVER_DISPLAY_MS));
      setGameState("idle");
    })();
  }, [gameState]);

  const start = () => {
    if (gameState !== "idle") {
      return;
    }
    sequencer.resetSequence();
    setGameState("playing:computer");
  };

  const input = (pad: PadTone) => {
    if (gameState !== "playing:user") {
      return;
    }
    if (pad !== sequencer.valueAt(seqIndex)) {
      setGameState("gameOver");
    }
    setSeqIndex((prev) => prev + 1);
  };

  return {
    state: gameState,
    actions: {
      start,
      input,
    },
  };
};
