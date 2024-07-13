import { PadTone } from "../../types/pad";
import { getSequencer } from "../sequencer";
import { gameLogic } from "./logic";
import { GameStatus, GameMachineState } from "./types";

const transition = ({
  currentState,
  to,
}: {
  currentState: GameMachineState;
  to: GameStatus;
}): GameMachineState => {
  switch (to) {
    case "idle":
      return { ...currentState, status: "idle" };
    case "computerTurn":
      return { ...currentState, status: "computerTurn" };
    case "userTurn":
      return { ...currentState, status: "userTurn", userSeqIndex: 0 };
    case "gameOver":
      return { ...currentState, status: "gameOver" };
    default:
      throw new Error("invalid status for transition");
  }
};

const start = ({
  currentState,
}: {
  currentState: GameMachineState;
}): GameMachineState => {
  if (currentState.status !== "idle") {
    return currentState;
  }
  getSequencer().resetSequence();
  return { ...currentState, status: "computerTurn" };
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
    return { ...currentState, status: "gameOver" };
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
