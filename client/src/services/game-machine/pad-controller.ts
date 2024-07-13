import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivePads, PadId } from "../../components/Gamepad/types";
import { getSequencer } from "../sequencer";
import { padKeyToPadId } from "../../utils/pads";
import { pads } from "../../components/Gamepad/schema";

const INIT_PADS_ACTIVE: ActivePads = Object.fromEntries(
  Object.keys(pads).map((padId) => [padId, false as boolean | undefined])
);

export const usePadController = ({
  onUserPadDown,
  arePadsDisabled,
}: {
  onUserPadDown: (padId: PadId) => void;
  arePadsDisabled: boolean;
}) => {
  const [computerPadsActive, setComputerPadsActive] =
    useState(INIT_PADS_ACTIVE);
  const [userPadsActive, setUserPadsActive] = useState(INIT_PADS_ACTIVE);

  useEffect(() => {
    getSequencer().setOnPlayPadTone((padId: PadId | undefined) => {
      if (!padId) {
        return;
      }
      setComputerPadsActive((prev) => ({ ...prev, [padId]: true }));
      // after note duration, make it inactive
      setTimeout(
        () =>
          setComputerPadsActive((prev) => ({ ...prev, [padId]: undefined })),
        getSequencer().noteDurationMs / 2
      );
    });
  }, []);

  const userPadDown = useCallback(
    (padId: PadId) => {
      if (arePadsDisabled) {
        return;
      }
      setUserPadsActive((prev) => ({ ...prev, [padId]: true }));
      onUserPadDown(padId);
    },
    [arePadsDisabled, onUserPadDown]
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) {
        event.preventDefault();
        return;
      }
      const padId = padKeyToPadId(event.key);
      if (!padId) {
        return;
      }
      userPadDown(padId);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [userPadDown]);

  const userPadUp = useCallback((padId: PadId) => {
    setUserPadsActive((prev) => ({ ...prev, [padId]: false }));
  }, []);

  useEffect(() => {
    const onKeyUp = (event: KeyboardEvent) => {
      const padId = padKeyToPadId(event.key);
      if (!padId) {
        return;
      }
      userPadUp(padId);
    };
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [userPadUp]);

  // pads are active if either the user or computer have them active
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
