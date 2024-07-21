import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivePads, PadId } from "./types";
import { sequencer } from "../../services/sequencer";
import { pads } from "./schema";
import { keyToPadId } from "../../utils/pads";

const INIT_PADS_ACTIVE: ActivePads = Object.fromEntries(
  Object.keys(pads).map((padId) => [padId, false as boolean | undefined])
);

export const usePadController = ({
  onUserPadDown,
}: {
  onUserPadDown: (padId: PadId) => void;
}) => {
  const [computerPadsActive, setComputerPadsActive] =
    useState(INIT_PADS_ACTIVE);
  const [userPadsActive, setUserPadsActive] = useState(INIT_PADS_ACTIVE);

  useEffect(() => {
    sequencer.setOnPlayPadTone((padId: PadId) => {
      setComputerPadsActive((prev) => ({ ...prev, [padId]: true }));
      // after note duration, make it inactive
      setTimeout(
        () => setComputerPadsActive((prev) => ({ ...prev, [padId]: false })),
        sequencer.noteDurationMs / 2
      );
    });
  }, []);

  const userPadDown = useCallback(
    (padId: PadId) => {
      setUserPadsActive((prev) => ({ ...prev, [padId]: true }));
      onUserPadDown(padId);
    },
    [onUserPadDown]
  );

  const userPadUp = useCallback((padId: PadId) => {
    setUserPadsActive((prev) => ({ ...prev, [padId]: false }));
  }, []);

  useKeyListeners({ onKeydown: userPadDown, onKeyup: userPadUp });

  // pads are active if either the user or computer has them active
  const activePads = useMemo<ActivePads>(
    () =>
      Object.fromEntries(
        Object.keys(pads).map((padId) => {
          return [padId, computerPadsActive[padId] || userPadsActive[padId]];
        })
      ),
    [computerPadsActive, userPadsActive]
  );

  return { activePads, userPadDown, userPadUp };
};

const useKeyListeners = ({
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
