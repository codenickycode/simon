import { useEffect, useState } from "react";
import "./App.css";
import { Gamepad } from "./components/Gamepad";
import { initSeq, start } from "./services/tone";
import { PadTone } from "./types/pad";

function App() {
  const [activePad, setActivePad] = useState<PadTone | undefined>();
  useEffect(() => {
    initSeq((padTone: PadTone | undefined) => setActivePad(padTone));
  }, []);
  return (
    <div>
      <Gamepad activePad={activePad} />
      <button onClick={start}>start</button>
    </div>
  );
}

export default App;
