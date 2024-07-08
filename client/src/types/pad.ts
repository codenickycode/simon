export type PadColor = "green" | "red" | "blue" | "yellow";
export type PadTone = "E4" | "C#4" | "E5" | "A4";
export type PadKey = "q" | "w" | "s" | "a";
export interface PadConfig {
  tone: PadTone;
  key: PadKey;
}
export const PADS: { [key in PadColor]: PadConfig } = {
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

export const keyToPadTone = (key: string): PadTone | undefined => {
  const pad = Object.values(PADS).find((pad) => pad.key === key);
  return pad?.tone;
};
