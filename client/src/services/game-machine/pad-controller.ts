import { useEffect, useState } from "react";
import { keyToPadTone, PadTone } from "../../types/pad";
import { getSequencer } from "../sequencer";

export const usePadController = ({
  onPadDown,
}: {
  onPadDown: (pad: PadTone) => void;
}) => {
  const [activePad, setActivePad] = useState<PadTone | undefined>();
  useEffect(() => {
    getSequencer().setOnPlayNote((padTone: PadTone | undefined) => {
      setActivePad(padTone);
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
      const tone = keyToPadTone(event.key);
      tone && onPadDown(tone);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onPadDown]);
  return { activePad };
};
