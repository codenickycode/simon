import { useEffect, useMemo, useState } from 'react';
import { useSet } from './../../utils/set';
import { sequencer } from './../../services/sequencer';
import { noteToPadId } from './../../utils/pads';
import type { PadId } from './types';
import type { SequencerNoteEvent } from '../../services/sequencer/sequencer';

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
    const listener = (event: Event) => {
      const note = (event as unknown as SequencerNoteEvent).detail.note;
      const padId = noteToPadId(note);
      padId && computerPadsActive.add(padId);
      // after note duration, make it inactive
      setTimeout(() => {
        const padId = noteToPadId(note);
        padId && computerPadsActive.delete(padId);
      }, sequencer.noteDuration.ms / 2);
    };
    sequencer.addEventListener(sequencer.NOTE_EVENT, listener);
    return () => sequencer.removeEventListener(sequencer.NOTE_EVENT, listener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [computerPadsActive.add, computerPadsActive.delete]);

  // pads are active if either the user or computer has them active
  const activePads = useMemo<Set<PadId>>(
    () =>
      new Set<PadId>([...computerPadsActive.items, ...userPadsActive.items]),
    [computerPadsActive, userPadsActive],
  );

  return {
    activePads,
    setUserPadActive: userPadsActive.add,
    setUserPadInactive: userPadsActive.delete,
  };
};
