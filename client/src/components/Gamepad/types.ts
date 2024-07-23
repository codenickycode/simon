export type PadId = "green" | "red" | "blue" | "yellow";
export type PadTone = "E4" | "C#4" | "E5" | "A4";
export type PadKey = "q" | "w" | "s" | "a";
export interface PadConfig {
  tone: PadTone;
  key: PadKey;
}
