import { useEffect, useState } from "react";
import "./App.css";
import { Gamepad } from "./components/Gamepad";
import { initSeq, isSequenceStarted, playTone, start } from "./services/tone";
import { PadTone, keyToPadTone } from "./types/pad";

function App() {
  const [activePad, setActivePad] = useState<PadTone | undefined>();
  useEffect(() => {
    initSeq((padTone: PadTone | undefined) => {
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
    if (isSequenceStarted()) {
      return;
    }
    if (activePad) {
      playTone(activePad);
    }
  }, [activePad]);
  return (
    <div>
      <Gamepad activePad={activePad} setActivePad={setActivePad} />
      <button onClick={start}>start</button>
    </div>
  );
}

export default App;
