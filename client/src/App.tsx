import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Gamepad } from "./components/Gamepad/Gamepad";
import { useGameMachine } from "./services/game-machine";
import { HighScore } from "./components/HighScore";

const queryClient = new QueryClient();

function App() {
  const gameMachine = useGameMachine();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen p-4 flex flex-col items-center justify-between">
        <div className="h-24">
          <HighScore
            isGameOver={gameMachine.isGameOver}
            userScore={gameMachine.userScore}
          />
        </div>
        <div className="w-full max-w-full aspect-square">
          <Gamepad
            isComputerTurn={gameMachine.isComputerTurn}
            isUserTurn={gameMachine.isUserTurn}
            onUserPadDown={gameMachine.actions.input}
          />
        </div>
        <div className="h-24 flex flex-col items-center">
          <button onClick={gameMachine.actions.startNewGame}>start</button>
          {gameMachine.isGameOver && (
            <p className="mt-4 text-2xl font-bold">Game Over</p>
          )}
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
