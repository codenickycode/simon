import { useCallback } from 'react';
import { useActivePads } from './use-pad-controller.use-active-pads';
import { usePadKeyListeners } from './use-pad-controller.use-pad-key-listeners';
import { MonoSynth } from '../services/synth.mono-synth';
import type { PadId } from '../types';
import { PAD_SCHEMA } from '../config';

const NOTE_DURATION_S = 0.3;

export const userSynth = new MonoSynth();

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
      userSynth.playNote({
        note: PAD_SCHEMA[padId].tone,
        duration: NOTE_DURATION_S,
      });
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
