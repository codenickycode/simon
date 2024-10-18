import { useCallback, useReducer } from 'react';
import type { Transition } from './use-game-machine.types';
import { gameMachineReducer } from './use-game-machine.reducer';
import { gameLogic, NEW_GAME_STATE } from './use-game-machine.logic';
import { useOnEntry } from './use-game-machine.use-on-entry';
import { melodyPlayer } from '../services/melody-player';
import type { PadId } from '../types';
import type { HighScoreEntry } from 'types.shared';

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
    ({ to }) => dispatch({ type: 'transition', to }),
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
        transition({ to: 'userTurn' });
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
