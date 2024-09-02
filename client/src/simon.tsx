import { useGameMachine } from './components/use-game-machine';
import { GameOverModal } from './components/game-over-modal';
import { usePadController } from './components/use-pad-controller';
import {
  useGetHighScoreApi,
  useUpdateHighScoreApi,
} from './services/api.high-score';
import { Button } from './components/ui.button';
import { HighScoreDisplay } from './components/high-score-display';
import { Pads } from './components/pads';

export function Simon() {
  const getHighScoreApi = useGetHighScoreApi();
  const updateHighScoreApi = useUpdateHighScoreApi();

  const gameMachine = useGameMachine({
    currentHighScore: getHighScoreApi.data?.highScore,
  });

  const padController = usePadController({
    onUserPadDown: gameMachine.actions.input,
    disabled: gameMachine.isComputerTurn,
  });

  return (
    <main className="font-sans text-slate-200 overflow-hidden fixed h-dvh w-full touch-none bg-gradient-to-b from-slate-700 to-sky-950 flex items-center justify-center">
      <div className="w-full h-full flex flex-col landscape:flex-row max-w-screen-2xl items-center justify-evenly">
        <section className="h-24 landscape:h-auto w-full flex items-center justify-center">
          {!gameMachine.isPlaying && (
            <HighScoreDisplay getHighScoreApi={getHighScoreApi} />
          )}
        </section>
        <section aria-label="gamepad">
          <Pads
            isPlaying={gameMachine.isPlaying}
            isUserTurn={gameMachine.isUserTurn}
            currentScore={gameMachine.currentScore}
            padController={padController}
          />
        </section>
        <section className="h-24 landscape:h-auto w-full flex items-center justify-center">
          {!gameMachine.isPlaying && (
            <Button onClick={gameMachine.actions.startNewGame}>
              <span className="text-xl md:text-2xl font-bold">start</span>
            </Button>
          )}
        </section>
      </div>
      {gameMachine.isGameOver && (
        <GameOverModal
          userScore={gameMachine.userScore}
          isNewHighScore={gameMachine.isNewHighScore}
          onModalClose={() => gameMachine.actions.transition({ to: 'newGame' })}
          pausePadKeyListeners={padController.padKeyListeners.pause}
          getHighScoreApi={getHighScoreApi}
          updateHighScoreApi={updateHighScoreApi}
        />
      )}
    </main>
  );
}
