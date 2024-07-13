import { PadTone } from "../../types/pad";
import { getSequencer } from "../sequencer";
import { gameLogic, NEW_GAME_STATE } from "./logic";
import { GameStatus, GameMachineState } from "./types";

const transition = ({
  currentState,
  to,
}: {
  currentState: GameMachineState;
  to: GameStatus;
}): GameMachineState => {
  switch (to) {
    case "newGame":
      return { ...NEW_GAME_STATE };
    case "computerTurn":
      return {
        ...currentState,
        status: "computerTurn",
        userScore: currentState.userSeqIndex,
        userSeqIndex: 0,
      };
    case "userTurn":
      return { ...currentState, status: "userTurn" };
    case "gameOver":
      return {
        ...currentState,
        status: "gameOver",
      };
    default:
      throw new Error("invalid status for transition");
  }
};

const start = ({
  currentState,
}: {
  currentState: GameMachineState;
}): GameMachineState => {
  if (currentState.status !== "newGame" && currentState.status !== "gameOver") {
    return currentState;
  }
  getSequencer().resetSequence();
  return transition({
    currentState: { ...NEW_GAME_STATE },
    to: "computerTurn",
  });
};

const input = ({
  currentState,
  pad,
}: {
  currentState: GameMachineState;
  pad: PadTone;
}): GameMachineState => {
  if (currentState.status !== "userTurn") {
    return currentState;
  }
  if (!gameLogic.checkInput(pad, currentState.userSeqIndex)) {
    return transition({ currentState, to: "gameOver" });
  }
  const nextIdx = currentState.userSeqIndex + 1;
  if (gameLogic.isSequenceComplete(nextIdx)) {
    return transition({
      currentState: { ...currentState, userSeqIndex: nextIdx },
      to: "computerTurn",
    });
  }
  return transition({
    currentState: {
      ...currentState,
      userSeqIndex: nextIdx,
    },
    to: "userTurn",
  });
};

export const actions = { transition, start, input };
