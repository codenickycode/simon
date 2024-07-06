import { useCallback, useEffect, useState } from "react";
import { keyToPadTone, PadTone } from "../../types/pad";
import { sequencer } from "../sequencer";
import { GameEvent } from "./types";

export const usePadController = ({
  isComputerTurn,
  send,
}: {
  isComputerTurn: boolean;
  send: (event: GameEvent) => void;
}) => {
  const onPadDown = useCallback(
    (note: PadTone) => {
      sequencer.playNote(note);
      send({ type: "input", value: note });
    },
    [send]
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
