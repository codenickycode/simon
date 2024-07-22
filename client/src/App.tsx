import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGameMachine } from "./services/game-machine";
import { GameOverModal } from "./components/game-over/game-over-modal";
import { Gamepad } from "./components/gamepad/gamepad";

const queryClient = new QueryClient();

function App() {
  const gameMachine = useGameMachine();
  return (
    <QueryClientProvider client={queryClient}>
      <main className="font-sans text-slate-200 overflow-hidden fixed h-dvh w-full touch-none bg-gradient-to-b from-slate-700 to-sky-950 flex items-center justify-center">
        <Gamepad {...gameMachine} />
        <GameOverModal
          isGameOver={gameMachine.isGameOver}
          userScore={gameMachine.userScore}
          goToNewGameState={() =>
            gameMachine.actions.transition({ to: "newGame" })
          }
        />
      </main>
    </QueryClientProvider>
  );
}

export default App;
