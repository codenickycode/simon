import { useEffect, useState } from "react";
import { PadTone } from "../../types/pad";
import { sequencer, TIMING_BUFFER_MS } from "../sequencer";

const GAME_OVER_DISPLAY_MS = 2000;

export type GameState = "idle" | "computerTurn" | "userTurn" | "gameOver";

export type Transition = Record<GameState, () => void>;

export const useGameMachine = () => {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [seqIndex, setSeqIndex] = useState(0);

  const transition: Transition = {
    idle: () => {
      setGameState("idle");
    },
    computerTurn: () => {
      setGameState("computerTurn");
    },
    userTurn: () => {
      setSeqIndex(0);
      setGameState("userTurn");
    },
    gameOver: () => {
      setGameState("gameOver");
    },
  };

  const { start } = useIdleState({ gameState, transition });
  useComputerTurnState({ gameState, transition });
  const { input } = useUserTurnState({
    gameState,
    seqIndex,
    setSeqIndex,
    transition,
  });
  useGameOverState({ gameState, transition });

  return {
    state: gameState,
    actions: {
      start,
      input,
    },
  };
};

const useIdleState = ({
  gameState,
  transition,
}: {
  gameState: GameState;
  transition: Transition;
}) => {
  const start = () => {
    if (gameState !== "idle") {
      return;
    }
    sequencer.resetSequence();
    transition.computerTurn();
  };
  return { start };
};

const useComputerTurnState = ({
  gameState,
  transition,
}: {
  gameState: GameState;
  transition: Transition;
}) => {
  useEffect(() => {
    if (gameState !== "computerTurn") {
      return;
    }
    (async () => {
      sequencer.addRandomNoteToSequence();
      // a short delay before playing the sequence
      await new Promise((res) => setTimeout(res, TIMING_BUFFER_MS));
      await sequencer.playSequence();
      transition.userTurn();
    })();
  }, [gameState, transition]);
};

const useUserTurnState = ({
  gameState,
  seqIndex,
  setSeqIndex,
  transition,
}: {
  gameState: GameState;
  seqIndex: number;
  setSeqIndex: (cb: (prev: number) => number) => void;
  transition: Transition;
}) => {
  useEffect(() => {
    if (gameState !== "userTurn") {
      return;
    }
    if (seqIndex && seqIndex === sequencer.length()) {
      transition.computerTurn();
    }
  }, [gameState, seqIndex, transition]);

  const input = (pad: PadTone) => {
    if (gameState !== "userTurn") {
      return;
    }
    if (pad !== sequencer.valueAt(seqIndex)) {
      return transition.gameOver();
    }
    setSeqIndex((prev) => prev + 1);
  };

  return { input };
};

const useGameOverState = ({
  gameState,
  transition,
}: {
  gameState: GameState;
  transition: Transition;
}) => {
  useEffect(() => {
    if (gameState !== "gameOver") {
      return;
    }
    (async () => {
      // display game over screen for a time, then return to idle state
      await new Promise((res) => setTimeout(res, GAME_OVER_DISPLAY_MS));
      transition.idle();
    })();
  }, [gameState, transition]);
};
