import { useEffect, useState } from "react";
import { Gamepad } from "./components/Gamepad";
import { Sequencer } from "./services/sequencer";
import { PadTone, keyToPadTone } from "./types/pad";
import { useGameMachine } from "./services/game-machine";

const sequencer = new Sequencer();

function App() {
  const [state, send] = useGameMachine(sequencer);
  const [activePad, setActivePad] = useState<PadTone | undefined>();
  useEffect(() => {
    sequencer.setOnDraw((padTone: PadTone | undefined) => {
      setActivePad(padTone);
      setTimeout(() => setActivePad(undefined), 150);
    });
  }, []);
  useEffect(() => {
    const handleKeyDown = (event: { key: string }) => {
      const tone = keyToPadTone(event.key);
      if (!activePad) {
        setActivePad(tone);
      }
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
  }, [activePad]);
  useEffect(() => {
    if (sequencer.isStarted()) {
      return;
    }
    if (activePad) {
      sequencer.playTone(activePad);
    }
  }, [activePad]);
  return (
    <div>
      <Gamepad
        activePad={activePad}
        setActivePad={setActivePad}
        onInput={(padTone: PadTone) => send({ type: "input", value: padTone })}
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
