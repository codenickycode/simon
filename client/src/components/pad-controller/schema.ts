import type { DeepReadonly } from "../../types";
import type { PadConfig, PadId } from "./types";

export const pads: DeepReadonly<{ [key in PadId]: PadConfig }> = {
  green: {
    tone: "E4",
    key: "q",
  },
  red: {
    tone: "C4",
    key: "w",
  },
  blue: {
    tone: "C5",
    key: "s",
  },
  yellow: {
    tone: "G4",
    key: "a",
  },
} as const;
