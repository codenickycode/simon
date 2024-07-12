import { useCallback, useEffect, useState } from "react";
import { keyToPadTone, PadTone } from "../types/pad";
import { sequencer } from "./sequencer";

export const usePadController = ({
  isComputerTurn,
  input,
}: {
  isComputerTurn: boolean;
  input: (pad: PadTone) => void;
}) => {
  const onPadDown = useCallback(
    (pad: PadTone) => {
      sequencer.playNote(pad);
      input(pad);
    },
    [input]
  );
  const [activePad, setActivePad] = useState<PadTone | undefined>();
  useEffect(() => {
    sequencer.setOnPlayNote((padTone: PadTone | undefined) => {
      setActivePad(padTone);
      // TODO: This should be note duration in ms
      // when the sequencer plays a note, it is a "pad down", so set a timeout and
      // give it a "pad up"
      setTimeout(() => setActivePad(undefined), 150);
    });
  }, []);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || isComputerTurn) {
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
  }, [isComputerTurn, onPadDown]);
  return { activePad, onPadDown };
};
