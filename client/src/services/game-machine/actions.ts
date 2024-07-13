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
      return { ...currentState, status: "computerTurn" };
    case "userTurn":
      return { ...currentState, status: "userTurn", userSeqIndex: 0 };
    case "gameOver":
      return {
        ...currentState,
        status: "gameOver",
        userScore: currentState.userSeqIndex,
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
  const newIdx = currentState.userSeqIndex + 1;
  const status = gameLogic.isSequenceComplete(newIdx)
    ? "computerTurn"
    : currentState.status;
  return {
    ...currentState,
    userSeqIndex: newIdx,
    status,
  };
};

export const actions = { transition, start, input };
