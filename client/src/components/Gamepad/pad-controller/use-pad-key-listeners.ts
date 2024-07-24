import { useEffect } from "react";
import { PadId } from "../types";
import { keyToPadId } from "../../../utils/pads";

/** Listen for keydown events that are a pad input */
export const usePadKeyListeners = ({
  onKeydown,
  onKeyup,
}: {
  onKeydown: (padId: PadId) => void;
  onKeyup: (padId: PadId) => void;
}) => {
  useEffect(() => {
    const keydownListener = (event: KeyboardEvent) => {
      if (event.repeat) {
        event.preventDefault();
        return;
      }
      const padId = keyToPadId(event.key);
      if (!padId) {
        return;
      }
      onKeydown(padId);
    };
    window.addEventListener("keydown", keydownListener);
    return () => {
      window.removeEventListener("keydown", keydownListener);
    };
  }, [onKeydown]);

  useEffect(() => {
    const keyupListener = (event: KeyboardEvent) => {
      const padId = keyToPadId(event.key);
      if (!padId) {
        return;
      }
      onKeyup(padId);
    };
    window.addEventListener("keyup", keyupListener);
    return () => {
      window.removeEventListener("keyup", keyupListener);
    };
  }, [onKeyup]);
};
