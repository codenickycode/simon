import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Gamepad } from "./components/Gamepad";
import { useGameController } from "./services/game-machine";
import { HighScore } from "./components/HighScore";

const queryClient = new QueryClient();

function App() {
  const { padController, gameState } = useGameController();
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <Gamepad {...padController} isComputerTurn={gameState.isComputerTurn} />
        <button onClick={gameState.startSequence}>start</button>
        <div>
          <h1>DISABLED: {JSON.stringify(gameState.isComputerTurn)}</h1>
          <h1>State: {JSON.stringify(gameState.state.value, null, 2)}</h1>
          <pre>
            <code>{JSON.stringify(gameState.state, null, 2)}</code>
          </pre>
        </div>
        <HighScore />
      </div>
    </QueryClientProvider>
  );
}

export default App;
