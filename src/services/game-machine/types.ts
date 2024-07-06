import { PadTone } from "../../types/pad";

export interface GameContext {
  i: number;
  highScore: number;
}

export type GameEvent =
  | { type: "sequenceComplete" }
  | { type: "start" }
  | { type: "padDown"; value: PadTone };
