import { useCallback, useEffect, useState } from "react";
import { keyToPadTone, PadTone } from "../../types/pad";
import { sequencer } from "../sequencer";
import { useKeyCycle } from "../../utils/keyboard";
import { GameEvent } from "./types";

export const usePadController = ({
  send,
}: {
  send: (event: GameEvent) => void;
}) => {
  const [activePad, setActivePad] = useState<PadTone | undefined>();
  const onPadDown = useCallback(
    (note: PadTone) => {
      send({ type: "padDown", value: note });
    },
    [send]
  );
  const onPadUp = useCallback(() => setActivePad(undefined), []);
  useEffect(() => {
    sequencer.setOnPlayNote((padTone: PadTone | undefined) => {
      setActivePad(padTone);
      // TODO: This should be note duration in ms
      // when the sequencer plays a note, it is a "pad down", so set a timeout and
      // give it a "pad up"
      setTimeout(onPadUp, 150);
    });
  }, [onPadUp]);
  useKeyCycle({
    downHandler: (key: string) => {
      const tone = keyToPadTone(key);
      tone && onPadDown(tone);
    },
    upHandler: onPadUp,
  });
  return { activePad, onPadDown, onPadUp };
};
