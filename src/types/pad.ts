export type PadColor = "green" | "red" | "blue" | "yellow";
export type PadTone = "E4" | "C#4" | "E5" | "A4";
export const PAD_TONES: { [key in PadColor]: PadTone } = {
  green: "E4",
  red: "C#4",
  blue: "E5",
  yellow: "A4",
};
