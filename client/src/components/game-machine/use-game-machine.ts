import { useCallback, useReducer } from 'react';
import type { PadId } from '../../components/pad-controller';
import type { Transition } from './types';
import { gameMachineReducer } from './reducer';
import { gameLogic, NEW_GAME_STATE } from './logic';
import type { HighScoreEntry } from '@simon/shared';
import { melodyPlayer } from '../../services/melody-player';
import { useOnEntry } from '../../utils/on-entry';

export type GameMachine = ReturnType<typeof useGameMachine>;

export const useGameMachine = ({
  currentHighScore,
}: {
  currentHighScore: HighScoreEntry | undefined;
}) => {
  const [gameMachine, dispatch] = useReducer(
    gameMachineReducer,
    NEW_GAME_STATE,
  );

  // *** Actions ***
  const transition: Transition = useCallback(
    ({ to, onlyIfState }) => dispatch({ type: 'transition', to, onlyIfState }),
    [],
  );
  const startNewGame = useCallback(
    () => dispatch({ type: 'startNewGame' }),
    [],
  );
  const input = useCallback(
    (padId: PadId) => dispatch({ type: 'input', padId }),
    [],
  );

  // *** Derived values / Aliases ***
  const isNewGame = gameMachine.state === 'newGame';
  const isComputerTurn = gameMachine.state === 'computerTurn';
  const isUserTurn = gameMachine.state === 'userTurn';
  const isPlaying = isUserTurn || isComputerTurn;
  const isGameOver = gameMachine.state === 'gameOver';
  const userScore = gameMachine.userScore;
  const currentScore = isComputerTurn ? userScore : gameMachine.userSeqIndex;
  const isNewHighScore = Boolean(
    isGameOver && currentHighScore && currentHighScore.score < userScore,
  );

  // *** State Hooks ***
  useOnEntry({
    target: 'computerTurn',
    currentState: gameMachine.state,
    cb: () => {
      gameLogic.nextSequence().then(() => {
        transition({ to: 'userTurn', onlyIfState: 'computerTurn' });
      });
    },
  });
  useOnEntry({
    target: 'gameOver',
    currentState: gameMachine.state,
    cb: () => {
      const melody = isNewHighScore ? 'highScore' : 'gameOver';
      melodyPlayer.play(melody);
    },
  });

  return {
    isNewGame,
    isComputerTurn,
    isUserTurn,
    isPlaying,
    isGameOver,
    userScore,
    currentScore,
    isNewHighScore,
    actions: {
      startNewGame,
      input,
      transition,
    },
  };
};
