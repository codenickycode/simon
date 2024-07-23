import { useCallback, useEffect, useMemo, useState } from "react";
import { PadId } from "./types";
import { sequencer } from "../../services/sequencer";
import { keyToPadId, noteToPadId } from "../../utils/pads";
import { toggleSetItem } from "../../utils/set";
import { Note } from "../../services/sequencer/types";
import { pads } from "./schema";

const INIT_PADS_ACTIVE = new Set<PadId>();

export const usePadController = ({
  onUserPadDown,
}: {
  onUserPadDown: (padId: PadId) => void;
}) => {
  const [computerPadsActive, setComputerPadsActive] =
    useState(INIT_PADS_ACTIVE);
  const [userPadsActive, setUserPadsActive] = useState(INIT_PADS_ACTIVE);

  useEffect(() => {
    sequencer.setOnPlaySynthComputer((note: Note) => {
      setComputerPadsActive((prev) => {
        const item = noteToPadId(note);
        return item ? toggleSetItem({ set: prev, item, op: "add" }) : prev;
      });
      // after note duration, make it inactive
      setTimeout(
        () =>
          setComputerPadsActive((prev) => {
            const item = noteToPadId(note);
            return item
              ? toggleSetItem({ set: prev, item, op: "delete" })
              : prev;
          }),
        sequencer.noteDurationMs / 2
      );
    });
  }, []);

  const userPadDown = useCallback(
    (padId: PadId) => {
      setUserPadsActive((prev) => {
        return toggleSetItem({ set: prev, item: padId, op: "add" });
      });
      sequencer.playSynthUser(pads[padId].tone);
      onUserPadDown(padId);
    },
    [onUserPadDown]
  );

  const userPadUp = useCallback((padId: PadId) => {
    setUserPadsActive((prev) => {
      return toggleSetItem({ set: prev, item: padId, op: "delete" });
    });
  }, []);

  useKeyListeners({ onKeydown: userPadDown, onKeyup: userPadUp });

  // pads are active if either the user or computer has them active
  const activePads = useMemo<Set<PadId>>(
    () => new Set<PadId>([...computerPadsActive, ...userPadsActive]),
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
