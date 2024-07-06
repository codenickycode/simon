import { Gamepad } from "./components/Gamepad";
import { useGameMachine } from "./services/game-machine";

function App() {
  const { activePad, onPadDown, onPadUp, startSequence, highScore, state } =
    useGameMachine();

  return (
    <div>
      <Gamepad activePad={activePad} onPadDown={onPadDown} onPadUp={onPadUp} />
      <button onClick={startSequence}>start</button>
      <h1>High Score: {highScore}</h1>
      <div>
        <h1>State: {JSON.stringify(state.value, null, 2)}</h1>
        <pre>
          <code>{JSON.stringify(state, null, 2)}</code>
        </pre>
      </div>
    </div>
  );
}

export default App;
