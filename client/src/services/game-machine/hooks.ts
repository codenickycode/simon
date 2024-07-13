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
      default: {
        return;
      }
    }
  }, [status, transition]);
};
