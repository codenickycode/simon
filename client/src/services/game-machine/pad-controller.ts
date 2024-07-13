import { useEffect, useState } from "react";
import { PadId } from "../../components/Gamepad/types";
import { getSequencer } from "../sequencer";
import { padKeyToPadId } from "../../utils/pads";

export const usePadController = ({
  onPadDown,
}: {
  onPadDown: (padId: PadId) => void;
}) => {
  const [activePad, setActivePad] = useState<PadId | undefined>();
  useEffect(() => {
    getSequencer().setOnPlayPadTone((padId: PadId | undefined) => {
      setActivePad(padId);
      // TODO: This should be note duration in ms
      // when the sequencer plays a note, it is a "pad down", so set a timeout and
      // give it a "pad up"
      setTimeout(() => setActivePad(undefined), 150);
    });
  }, []);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) {
        event.preventDefault();
        return;
      }
      const padId = padKeyToPadId(event.key);
      padId && onPadDown(padId);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onPadDown]);
  return { activePad };
};
