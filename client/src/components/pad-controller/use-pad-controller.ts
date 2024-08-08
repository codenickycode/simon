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
  resetActivePads,
}: {
  onUserPadDown: (padId: PadId) => void;
  disabled: boolean;
  /** Toggle this boolean to reset all active pads to null. Useful to prevent
   * "sticky" pads lit up when game state changes. */
  resetActivePads: boolean;
}) => {
  const { activePads, setUserPadActive, setUserPadInactive } =
    useActivePads(resetActivePads);

  const userPadDown = useCallback(
    (padId: PadId) => {
      if (disabled) {
        return;
      }
      setUserPadActive(padId);
      userSynth.playNote({
        note: pads[padId].tone,
        duration: NOTE_DURATION_S,
      });
      onUserPadDown(padId);
    },
    [disabled, onUserPadDown, setUserPadActive],
  );

  const userPadUp = useCallback(
    (padId: PadId) => {
      setUserPadInactive(padId);
    },
    [setUserPadInactive],
  );

  const padKeyListeners = usePadKeyListeners({
    onKeydown: userPadDown,
    onKeyup: userPadUp,
    disabled,
  });

  return { activePads, userPadDown, userPadUp, padKeyListeners };
};
