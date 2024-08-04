import { useCallback } from 'react';
import { sequencer } from './../../services/sequencer';
import { useActivePads } from './use-active-pads';
import { usePadKeyListeners } from './use-pad-key-listeners';
import type { PadId } from './types';
import { pads } from './schema';

export const usePadController = ({
  onUserPadDown,
  resetActivePads,
}: {
  onUserPadDown: (padId: PadId) => void;
  /** Toggle this boolean to reset all active pads to null. Useful to prevent
   * "sticky" pads lit up when game state changes. */
  resetActivePads: boolean;
}) => {
  const { activePads, setUserPadActive, setUserPadInactive } =
    useActivePads(resetActivePads);

  const userPadDown = useCallback(
    (padId: PadId) => {
      setUserPadActive(padId);
      sequencer.synths.user.playNote(pads[padId].tone);
      onUserPadDown(padId);
    },
    [onUserPadDown, setUserPadActive],
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
  });

  return { activePads, userPadDown, userPadUp, padKeyListeners };
};
