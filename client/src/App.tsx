import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGameMachine } from './components/game-machine';
import { GameOverModal } from './components/game-over/game-over-modal';
import { Gamepad } from './components/gamepad';
import { usePadController } from './components/pad-controller';
import { initAudioContext } from './services/synth';
import { useGetHighScoreApi } from './services/api.high-score';
import { initMonitoring } from './services/monitoring/init-monitor';

initMonitoring();
initAudioContext();

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Simon />
    </QueryClientProvider>
  );
}

function Simon() {
  const getHighScoreApi = useGetHighScoreApi();
  const gameMachine = useGameMachine({
    currentHighScore: getHighScoreApi.data,
  });
  const padController = usePadController({
    onUserPadDown: gameMachine.actions.input,
    disabled: gameMachine.isComputerTurn,
    resetActivePads: !gameMachine.isPlaying,
  });
  return (
    <main className="font-sans text-slate-200 overflow-hidden fixed h-dvh w-full touch-none bg-gradient-to-b from-slate-700 to-sky-950 flex items-center justify-center">
      <Gamepad
        gameMachine={gameMachine}
        padController={padController}
        getHighScoreApi={getHighScoreApi}
      />
      {gameMachine.isGameOver && (
        <GameOverModal
          userScore={gameMachine.userScore}
          currentHighScore={getHighScoreApi.data}
          isNewHighScore={gameMachine.isNewHighScore}
          onModalClose={() => gameMachine.actions.transition({ to: 'newGame' })}
          padKeyListeners={padController.padKeyListeners}
        />
      )}
    </main>
  );
}
