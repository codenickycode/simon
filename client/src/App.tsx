import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Gamepad } from "./components/Gamepad/Gamepad";
import { useGameMachine } from "./services/game-machine";
import { HighScore } from "./components/HighScore";
import { usePadController } from "./services/pad-controller";

const queryClient = new QueryClient();

function App() {
  const gameMachine = useGameMachine();
  const padController = usePadController({
    isComputerTurn: gameMachine.isComputerTurn,
    input: gameMachine.actions.input,
  });
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <Gamepad
          {...padController}
          isComputerTurn={gameMachine.isComputerTurn}
        />
        <button onClick={gameMachine.actions.startNewGame}>start</button>
        <HighScore
          isGameOver={gameMachine.isGameOver}
          userScore={gameMachine.userScore}
        />
        {gameMachine.isGameOver && <h1>Game Over</h1>}
      </div>
    </QueryClientProvider>
  );
}

export default App;
