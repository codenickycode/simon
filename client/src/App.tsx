import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGameMachine } from './components/game-machine';
import { GameOverModal } from './components/game-over/game-over-modal';
import { Gamepad } from './components/gamepad';
import { usePadController } from './components/pad-controller';
import { initAudioContext } from './services/synth';

initAudioContext();

const queryClient = new QueryClient();

function App() {
  const gameMachine = useGameMachine();
  const padController = usePadController({
    onUserPadDown: gameMachine.actions.input,
    disabled: gameMachine.isComputerTurn,
    resetActivePads: !gameMachine.isPlaying,
  });
  return (
    <QueryClientProvider client={queryClient}>
      <main className="font-sans text-slate-200 overflow-hidden fixed h-dvh w-full touch-none bg-gradient-to-b from-slate-700 to-sky-950 flex items-center justify-center">
        <Gamepad gameMachine={gameMachine} padController={padController} />
        <GameOverModal
          isGameOver={gameMachine.isGameOver}
          userScore={gameMachine.userScore}
          // todo use callback
          goToNewGameState={() =>
            gameMachine.actions.transition({ to: 'newGame' })
          }
          padKeyListeners={padController.padKeyListeners}
        />
      </main>
    </QueryClientProvider>
  );
}

export default App;
