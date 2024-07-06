import { useCallback, useEffect, useState } from "react";
import { Gamepad } from "./components/Gamepad";
import { Sequencer } from "./services/sequencer";
import { PadTone, keyToPadTone } from "./types/pad";
import { useGameMachine } from "./services/game-machine";

const sequencer = new Sequencer();

function App() {
  const [state, send] = useGameMachine(sequencer);
  const playNote = useCallback(
    (note: PadTone) => {
      send({ type: "input", value: note });
    },
    [send]
  );
  const [activePad, setActivePad] = useState<PadTone | undefined>();
  useEffect(() => {
    sequencer.setOnPlayNote((padTone: PadTone | undefined) => {
      setActivePad(padTone);
      setTimeout(() => setActivePad(undefined), 150);
    });
  }, []);
  useEffect(() => {
    const handleKeyDown = (event: { key: string }) => {
      const tone = keyToPadTone(event.key);
      tone && playNote(tone);
    };
    const handleKeyUp = () => {
      setActivePad(undefined);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [activePad, playNote]);
  return (
    <div>
      <Gamepad
        activePad={activePad}
        onPadDown={playNote}
        onPadUp={() => setActivePad(undefined)}
      />
      <button onClick={() => send({ type: "start" })}>start</button>
      <h1>High Score: {state.context.highScore}</h1>
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
