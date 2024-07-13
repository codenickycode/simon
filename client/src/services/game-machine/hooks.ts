import { useEffect } from "react";
import { GameStatus, Transition } from "./types";
import { gameLogic } from "./logic";
import { delay } from "../../utils/delay";

/** How long to display game over screen before transitioning back to idle */
const GAME_OVER_DISPLAY_MS = 2000;

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
        delay(GAME_OVER_DISPLAY_MS).then(() => transition("idle"));
        return;
      }
      default: {
        return;
      }
    }
  }, [status, transition]);
};
