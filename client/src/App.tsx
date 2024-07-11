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
        <Gamepad
          {...padController}
          isComputerTurn={gameState.state === "playing:computer"}
        />
        <button onClick={gameState.actions.start}>start</button>
        <div>
          <pre>
            <code>{JSON.stringify(gameState, null, 2)}</code>
          </pre>
        </div>
        <HighScore />
      </div>
    </QueryClientProvider>
  );
}

export default App;
