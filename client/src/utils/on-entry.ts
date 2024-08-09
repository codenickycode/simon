import { useEffect, useRef } from 'react';
import type { GameState } from '../components/game-machine/types';
import type { NoOp } from './no-op';

export function useOnEntry({
  target,
  currentState,
  cb,
}: {
  target: GameState;
  currentState: GameState;
  cb: NoOp;
}) {
  const prevStateRef = useRef<GameState>(currentState);
  useEffect(() => {
    if (currentState === target && currentState !== prevStateRef.current) {
      cb();
    }
    prevStateRef.current = currentState;
  }, [currentState, cb, target]);
}
