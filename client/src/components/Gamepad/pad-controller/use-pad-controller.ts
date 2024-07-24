import { useCallback } from "react";
import { PadId } from "../types";
import { sequencer } from "../../../services/sequencer";
import { pads } from "../schema";
import { useActivePads } from "./use-active-pads";
import { usePadKeyListeners } from "./use-pad-key-listeners";

export const usePadController = ({
  onUserPadDown,
  resetActivePads,
}: {
  onUserPadDown: (padId: PadId) => void;
  /** Toggle this boolean to reset all active pads to null. Useful to prevent
   * "sticky" pads lit up when game state changes. */
  resetActivePads: boolean;
}) => {
  const { activePads, setUserPadActive, setUserPadInactive } =
    useActivePads(resetActivePads);

  const userPadDown = useCallback(
    (padId: PadId) => {
      setUserPadActive(padId);
      sequencer.playSynthUser(pads[padId].tone);
      onUserPadDown(padId);
    },
    [onUserPadDown, setUserPadActive]
  );

  const userPadUp = useCallback(
    (padId: PadId) => {
      setUserPadInactive(padId);
    },
    [setUserPadInactive]
  );

  usePadKeyListeners({ onKeydown: userPadDown, onKeyup: userPadUp });

  return { activePads, userPadDown, userPadUp };
};
