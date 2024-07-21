import { useEffect } from "react";
import { GameState, Transition } from "./types";
import { gameLogic } from "./logic";

/** "on entry" hooks to execute once after state change */
export const useOnEntry = ({
  state,
  transition,
}: {
  state: GameState;
  transition: Transition;
}) => {
  useEffect(() => {
    switch (state) {
      case "computerTurn": {
        gameLogic.nextSequence().then(() => {
          transition({ to: "userTurn", onlyIfState: "computerTurn" });
        });
        return;
      }
      default: {
        return;
      }
    }
  }, [state, transition]);
};
