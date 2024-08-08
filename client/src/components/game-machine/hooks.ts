import { useEffect } from 'react';
import type { GameState, Transition } from './types';
import { gameLogic } from './logic';
import { melodyPlayer } from '../../services/melody-player';

/** "on entry" hooks to execute once after state change */
export const useOnEntry = ({
  state,
  transition,
  isNewHighScore,
}: {
  state: GameState;
  transition: Transition;
  isNewHighScore: boolean;
}) => {
  useEffect(() => {
    switch (state) {
      case 'computerTurn': {
        gameLogic.nextSequence().then(() => {
          transition({ to: 'userTurn', onlyIfState: 'computerTurn' });
        });
        return;
      }
      case 'gameOver': {
        melodyPlayer.play(isNewHighScore ? 'highScore' : 'gameOver');
        return;
      }
      default: {
        return;
      }
    }
  }, [isNewHighScore, state, transition]);
};
