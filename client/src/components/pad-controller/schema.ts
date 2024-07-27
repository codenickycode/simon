import type { DeepReadonly } from "../../types";
import type { PadConfig, PadId } from "./types";

export const pads: DeepReadonly<{ [key in PadId]: PadConfig }> = {
  green: {
    tone: "E4",
    key: "q",
  },
  red: {
    tone: "C#4",
    key: "w",
  },
  blue: {
    tone: "E5",
    key: "s",
  },
  yellow: {
    tone: "A4",
    key: "a",
  },
} as const;
