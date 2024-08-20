import { useEffect, useRef } from 'react';
import type { NoOp } from './no-op';
import type { GameState } from '../components/use-game-machine.types';

// todo: this should be in the game machine dir
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
