import { useCallback, useEffect, useState } from "react";
import { PadTone } from "../types/pad";
import { sequencer } from "./sequencer";
import { delay } from "../utils/delay";
import { hackyNextStateSync } from "../utils/react";

/** A generic buffer to prevent feedback from happening to quickly for user */
const TIMING_BUFFER_MS = 500;
const GAME_OVER_DISPLAY_MS = 2000;

export type GameState = "idle" | "computerTurn" | "userTurn" | "gameOver";

export type Transition = (to: GameState) => void;

export const useGameMachine = () => {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [seqIndex, setSeqIndex] = useState(0);
  const actions = useActions({
    gameState,
    setGameState,
    seqIndex,
    setSeqIndex,
  });
  useEntry({ gameState, transition: actions.transition });
  return {
    state: gameState,
    actions,
  };
};

/** Actions defined by the current state */
const useActions = ({
  gameState,
  setGameState,
  seqIndex,
  setSeqIndex,
}: {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  seqIndex: number;
  setSeqIndex: React.Dispatch<React.SetStateAction<number>>;
}) => {
  /** Transition to the provided game state */
  const transition: Transition = useCallback(
    (to: GameState) => {
      switch (to) {
        case "idle":
          return setGameState("idle");
        case "computerTurn":
          return setGameState("computerTurn");
        case "userTurn":
          setSeqIndex(0);
          return setGameState("userTurn");
        case "gameOver":
          return setGameState("gameOver");
        default:
          throw new Error("invalid state for transition");
      }
    },
    [setGameState, setSeqIndex]
  );

  /** Start a new game */
  const start = useCallback(() => {
    switch (gameState) {
      case "idle":
        sequencer.resetSequence();
        return transition("computerTurn");
      default:
        return;
    }
  }, [gameState, transition]);

  /** User inputs a pad press */
  const input = useCallback(
    (pad: PadTone) => {
      switch (gameState) {
        case "userTurn": {
          if (!gameLogic.checkInput(pad, seqIndex)) {
            return transition("gameOver");
          }
          const newSeqIdx = hackyNextStateSync(setSeqIndex, (prev) => prev + 1);
          if (gameLogic.isSequenceComplete(newSeqIdx)) {
            transition("computerTurn");
          }
          return;
        }
        default:
          return;
      }
    },
    [gameState, seqIndex, setSeqIndex, transition]
  );

  return { transition, start, input };
};

/** "on entry" functions to execute once after state change */
const useEntry = ({
  gameState,
  transition,
}: {
  gameState: GameState;
  transition: Transition;
}) => {
  useEffect(() => {
    switch (gameState) {
      case "computerTurn":
        sequencer.addRandomNoteToSequence();
        // play sequence after a short delay, then hand it off to the user
        delay(TIMING_BUFFER_MS, async () => {
          await sequencer.playSequence();
          transition("userTurn");
        });

        return;
      case "gameOver":
        // display game over screen for a time, then return to idle state
        delay(GAME_OVER_DISPLAY_MS, () => transition("idle"));
        return;
      default:
        return;
    }
  }, [gameState, transition]);
};

export const gameLogic = {
  checkInput: (pad: PadTone, currentIndex: number): boolean => {
    return pad === sequencer.valueAt(currentIndex);
  },
  isSequenceComplete: (currentIndex: number): boolean => {
    return currentIndex !== 0 && currentIndex === sequencer.length();
  },
};
