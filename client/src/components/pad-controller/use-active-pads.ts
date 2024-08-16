import { useCallback, useEffect, useState } from 'react';
import { sequencer } from './../../services/sequencer';
import { noteToPadId } from './../../utils/pads';
import type { PadId } from './types';
import type { SequencerNoteEvent } from '../../services/sequencer/sequencer';

export const useActivePads = () => {
  const [activePads, setActivePads] = useState(new Set<PadId>());

  const add = useCallback((padId: PadId) => {
    setActivePads((prev) => {
      const newSet = new Set(prev);
      newSet.add(padId);
      return newSet;
    });
  }, []);

  const del = useCallback((padId: PadId) => {
    setActivePads((prev) => {
      const newSet = new Set(prev);
      newSet.delete(padId);
      return newSet;
    });
  }, []);

  useEffect(() => {
    const listener = (event: Event) => {
      const note = (event as unknown as SequencerNoteEvent).detail.note;
      const padId = noteToPadId(note);
      if (!padId) {
        return;
      }
      add(padId);
      // after note duration, make it inactive
      setTimeout(() => {
        del(padId);
      }, sequencer.noteDuration.ms / 2);
    };
    sequencer.addEventListener(sequencer.NOTE_EVENT, listener);
    return () => sequencer.removeEventListener(sequencer.NOTE_EVENT, listener);
  }, [add, del]);

  return {
    activePads,
    setPadActive: add,
    setPadInactive: del,
  };
};
