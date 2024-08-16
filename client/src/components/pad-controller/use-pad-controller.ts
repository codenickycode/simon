import { useCallback } from 'react';
import { useActivePads } from './use-active-pads';
import { usePadKeyListeners } from './use-pad-key-listeners';
import type { PadId } from './types';
import { pads } from './schema';
import { MonoSynth } from '../../services/synth/mono-synth';

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
        note: pads[padId].tone,
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

  return { activePads, userPadDown, userPadUp, padKeyListeners };
};
