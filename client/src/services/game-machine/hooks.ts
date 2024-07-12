import { useEffect } from "react";
import { GameStatus, Transition } from "./types";
import { gameLogic } from "./logic";

/** "on entry" hooks to execute once after status change */
export const useOnEntry = ({
  status,
  transition,
}: {
  status: GameStatus;
  transition: Transition;
}) => {
  useEffect(() => {
    switch (status) {
      case "computerTurn": {
        gameLogic.nextSequence().then(() => transition("userTurn"));
        return;
      }
      case "gameOver": {
        gameLogic.displayGameOver().then(() => transition("idle"));
        return;
      }
      default: {
        return;
      }
    }
  }, [status, transition]);
};
