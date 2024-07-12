import { useCallback, useEffect, useReducer } from "react";
import { PadTone } from "../types/pad";
import { sequencer } from "./sequencer";
import { delay } from "../utils/delay";

/** A generic buffer to prevent feedback from happening to quickly for user */
const TIMING_BUFFER_MS = 500;
const GAME_OVER_DISPLAY_MS = 2000;

export type GameState = "idle" | "computerTurn" | "userTurn" | "gameOver";

export type Transition = (to: GameState) => void;

export const useGameMachine = () => {
  const [gameState, dispatch] = useReducer(reducer, {
    state: "idle",
    userSeqIndex: 0,
  });
  /** Transition to the provided game state */
  const transition = useCallback(
    (state: GameState) => dispatch({ type: "transition", state }),
    []
  );
  /** Start a new game */
  const start = useCallback(() => dispatch({ type: "start" }), []);
  /** User inputs a pad press */
  const input = useCallback(
    (pad: PadTone) => dispatch({ type: "input", pad }),
    []
  );
  useEntry({ state: gameState.state, transition });
  return {
    state: gameState.state,
    actions: {
      start,
      input,
    },
  };
};

interface ReducerState {
  state: GameState;
  userSeqIndex: number;
}

type ReducerAction =
  | {
      type: "transition";
      state: GameState;
    }
  | {
      type: "start";
    }
  | {
      type: "input";
      pad: PadTone;
    };

/** Actions defined by the current state */
const reducer = (
  currentState: ReducerState,
  action: ReducerAction
): ReducerState => {
  switch (action.type) {
    case "transition":
      switch (action.state) {
        case "idle":
          return { ...currentState, state: "idle" };
        case "computerTurn":
          return { ...currentState, state: "computerTurn" };
        case "userTurn":
          return { ...currentState, state: "userTurn", userSeqIndex: 0 };
        case "gameOver":
          return { ...currentState, state: "gameOver" };
        default:
          throw new Error("invalid state for transition");
      }
    case "start":
      if (currentState.state !== "idle") {
        return currentState;
      }
      sequencer.resetSequence();
      return { ...currentState, state: "computerTurn" };
    case "input": {
      if (currentState.state !== "userTurn") {
        return currentState;
      }
      if (!gameLogic.checkInput(action.pad, currentState.userSeqIndex)) {
        return { ...currentState, state: "gameOver" };
      }
      const newIdx = currentState.userSeqIndex + 1;
      const state = gameLogic.isSequenceComplete(newIdx)
        ? "computerTurn"
        : currentState.state;
      return {
        ...currentState,
        userSeqIndex: newIdx,
        state,
      };
    }
    default:
      throw new Error("action not implemented");
  }
};

/** "on entry" functions to execute once after state change */
const useEntry = ({
  state,
  transition,
}: {
  state: GameState;
  transition: Transition;
}) => {
  useEffect(() => {
    switch (state) {
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
  }, [state, transition]);
};

export const gameLogic = {
  checkInput: (pad: PadTone, currentIndex: number): boolean => {
    return pad === sequencer.valueAt(currentIndex);
  },
  isSequenceComplete: (currentIndex: number): boolean => {
    return currentIndex !== 0 && currentIndex === sequencer.length();
  },
};
