import { useEffect, useMemo, useState } from "react";
import { useSet } from "../../../utils/set";
import { PadId } from "../types";
import { sequencer } from "../../../services/sequencer";
import { noteToPadId } from "../../../utils/pads";
import { NoteOctave } from "../../../services/sequencer/types";

export const useActivePads = (resetActivePads: boolean) => {
  const computerPadsActive = useSet<PadId>();
  const userPadsActive = useSet<PadId>();
  const [reset, setReset] = useState(false);

  if (resetActivePads !== reset) {
    setReset(resetActivePads);
    computerPadsActive.reset();
    userPadsActive.reset();
  }

  useEffect(() => {
    sequencer.setOnPlaySynthComputer((note: NoteOctave) => {
      const item = noteToPadId(note);
      item && computerPadsActive.add(item);
      // after note duration, make it inactive
      setTimeout(() => {
        const item = noteToPadId(note);
        item && computerPadsActive.delete(item);
      }, sequencer.noteDurationMs / 2);
    });
  }, [computerPadsActive]);

  // pads are active if either the user or computer has them active
  const activePads = useMemo<Set<PadId>>(
    () =>
      new Set<PadId>([...computerPadsActive.items, ...userPadsActive.items]),
    [computerPadsActive, userPadsActive]
  );

  return {
    activePads,
    setUserPadActive: userPadsActive.add,
    setUserPadInactive: userPadsActive.delete,
  };
};
