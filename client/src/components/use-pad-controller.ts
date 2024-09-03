import { useCallback } from 'react';
import { useActivePads } from './use-pad-controller.use-active-pads';
import { usePadKeyListeners } from './use-pad-controller.use-pad-key-listeners';
import type { PadId } from '../types';
import { PAD_SCHEMA } from '../config';
import * as Tone from 'tone';

const NOTE_DURATION_S = 0.3;
const NOW_BUFFER_S = 0.032;

export const userSynth = new Tone.Synth().toDestination();

export type PadController = ReturnType<typeof usePadController>;

export const usePadController = ({
  onUserPadDown,
  disabled,
}: {
  onUserPadDown: (padId: PadId) => void;
  disabled: boolean;
}) => {
  const { activePads, setPadActive, setPadInactive } = useActivePads();

  const userPadDown = useCallback(
    (padId: PadId) => {
      if (disabled) {
        return;
      }
      setPadActive(padId);
      userSynth.triggerAttackRelease(
        PAD_SCHEMA[padId].tone,
        NOTE_DURATION_S,
        // schedule a little in advance to prevent pops
        // https://github.com/Tonejs/Tone.js/wiki/Performance#scheduling-in-advance
        Tone.getContext().currentTime + NOW_BUFFER_S,
      );
      onUserPadDown(padId);
    },
    [disabled, onUserPadDown, setPadActive],
  );

  const userPadUp = useCallback(
    (padId: PadId) => {
      setPadInactive(padId);
    },
    [setPadInactive],
  );

  const padKeyListeners = usePadKeyListeners({
    onKeydown: userPadDown,
    onKeyup: userPadUp,
    disabled,
  });

  return {
    activePads,
    userPadDown,
    userPadUp,
    padKeyListeners,
  };
};
