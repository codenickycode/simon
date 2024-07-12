import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Gamepad } from "./components/Gamepad";
import { useGameMachine } from "./services/game-machine";
import { HighScore } from "./components/HighScore";
import { usePadController } from "./services/pad-controller";

const queryClient = new QueryClient();

function App() {
  const gameMachine = useGameMachine();
  const isComputerTurn = gameMachine.status === "computerTurn";
  const padController = usePadController({
    isComputerTurn,
    input: gameMachine.actions.input,
  });
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <Gamepad {...padController} isComputerTurn={isComputerTurn} />
        <button onClick={gameMachine.actions.start}>start</button>
        <div>
          <pre>
            <code>{JSON.stringify(gameMachine, null, 2)}</code>
          </pre>
        </div>
        <HighScore />
      </div>
    </QueryClientProvider>
  );
}

export default App;
