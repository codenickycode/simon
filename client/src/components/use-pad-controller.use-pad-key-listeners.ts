import { useCallback, useEffect, useMemo, useState } from 'react';
import { keyToPadId } from '../utils/pads';
import type { PadId } from '../types';

export interface PadKeyListeners {
  pause: () => void;
  resume: () => void;
}

/** Listen for keydown events that are a pad input.
 * Can be paused, for instance when the user is typing. */
export const usePadKeyListeners = ({
  onKeydown,
  onKeyup,
  disabled,
}: {
  onKeydown: (padId: PadId) => void;
  onKeyup: (padId: PadId) => void;
  disabled: boolean;
}) => {
  const [paused, setPaused] = useState(false);
  const inactive = paused || disabled;

  const pause = useCallback(() => {
    setPaused(true);
  }, []);
  const resume = useCallback(() => {
    setPaused(false);
  }, []);

  useEffect(() => {
    const keydownListener = (event: KeyboardEvent) => {
      if (inactive) {
        return;
      }
      if (event.repeat) {
        event.preventDefault();
        return;
      }
      const padId = keyToPadId(event.key);
      if (!padId) {
        return;
      }
      onKeydown(padId);
    };
    window.addEventListener('keydown', keydownListener);
    return () => {
      window.removeEventListener('keydown', keydownListener);
    };
  }, [inactive, onKeydown]);

  useEffect(() => {
    const keyupListener = (event: KeyboardEvent) => {
      const padId = keyToPadId(event.key);
      if (!padId) {
        return;
      }
      onKeyup(padId);
    };
    window.addEventListener('keyup', keyupListener);
    return () => {
      window.removeEventListener('keyup', keyupListener);
    };
  }, [onKeyup]);

  return useMemo(() => ({ pause, resume }), [pause, resume]);
};
