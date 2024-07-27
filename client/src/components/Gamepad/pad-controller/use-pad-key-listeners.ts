import { useCallback, useEffect, useMemo, useState } from "react";
import { PadId } from "../types";
import { keyToPadId } from "../../../utils/pads";

/** Listen for keydown events that are a pad input.
 * Can be paused, for instance when the user is typing. */
export const usePadKeyListeners = ({
  onKeydown,
  onKeyup,
}: {
  onKeydown: (padId: PadId) => void;
  onKeyup: (padId: PadId) => void;
}) => {
  const [paused, setPaused] = useState(false);

  const pause = useCallback(() => {
    setPaused(true);
  }, []);
  const resume = useCallback(() => {
    setPaused(false);
  }, []);

  useEffect(() => {
    const keydownListener = (event: KeyboardEvent) => {
      if (paused) {
        return;
      }
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
  }, [onKeydown, paused]);

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

  return useMemo(() => ({ pause, resume }), [pause, resume]);
};
