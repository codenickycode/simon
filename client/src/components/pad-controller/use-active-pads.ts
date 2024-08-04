import { useEffect, useMemo, useState } from 'react';
import { useSet } from './../../utils/set';
import { sequencer } from './../../services/sequencer';
import { noteToPadId } from './../../utils/pads';
import type { NoteOctave } from '../../services/synth';
import { sequenceSynth } from '../../services/synth';
import type { PadId } from './types';

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
    const unsubscribe = sequenceSynth.subscribe((note: NoteOctave) => {
      const item = noteToPadId(note);
      item && computerPadsActive.add(item);
      // after note duration, make it inactive
      setTimeout(() => {
        const item = noteToPadId(note);
        item && computerPadsActive.delete(item);
      }, sequencer.noteDuration.ms / 2);
    });
    return () => unsubscribe();
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
