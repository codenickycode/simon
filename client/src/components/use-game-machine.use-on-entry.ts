import { useEffect, useRef } from 'react';
import type { NoOp } from '../utils/no-op';
import type { GameState } from './use-game-machine.types';

/** Executes a callback each time the current state changes to the target */
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
