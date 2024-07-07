import { Gamepad } from "./components/Gamepad";
import { useGameController } from "./services/game-machine";

function App() {
  const { padController, gameState } = useGameController();
  return (
    <div>
      <Gamepad {...padController} isComputerTurn={gameState.isComputerTurn} />
      <button onClick={gameState.startSequence}>start</button>
      <h1>High Score: {gameState.highScore}</h1>
      <div>
        <h1>DISABLED: {JSON.stringify(gameState.isComputerTurn)}</h1>
        <h1>State: {JSON.stringify(gameState.state.value, null, 2)}</h1>
        <pre>
          <code>{JSON.stringify(gameState.state, null, 2)}</code>
        </pre>
      </div>
    </div>
  );
}

export default App;
