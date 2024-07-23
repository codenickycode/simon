import { pads } from "../components/gamepad/schema";
import { PadId, PadKey, PadTone } from "../components/gamepad/types";

export const keyToPadId = (key: string): PadId | undefined => {
  const [padId] = Object.entries(pads).find(([, pad]) => pad.key === key) || [];
  // Object.entries is erasing the type of entries[0] which is the PadId
  return padId as PadId | undefined;
};
export const padKeyToPadTone = (key: PadKey): PadTone | undefined => {
  const pad = Object.values(pads).find((pad) => pad.key === key);
  return pad?.tone;
};
export const padToneToPadId = (tone: PadTone): PadId | undefined => {
  const [padId] =
    Object.entries(pads).find(([, pad]) => pad.tone === tone) || [];
  // Object.entries is erasing the type of entries[0] which is the PadId
  return padId as PadId | undefined;
};
export const padToneToPadKey = (tone: PadTone): PadKey | undefined => {
  const pad = Object.values(pads).find((pad) => pad.tone === tone);
  return pad?.key;
};
