import { pads } from "../components/Gamepad/schema";
import { PadKey, PadTone } from "../components/Gamepad/types";

export const padKeyToPadTone = (key: string): PadTone | undefined => {
  const pad = Object.values(pads).find((pad) => pad.key === key);
  return pad?.tone;
};
export const padToneToPadKey = (tone: PadTone): PadKey | undefined => {
  const pad = Object.values(pads).find((pad) => pad.tone === tone);
  return pad?.key;
};
