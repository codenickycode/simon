export type PadId = "green" | "red" | "blue" | "yellow";
export type PadTone = "C4" | "E4" | "G4" | "C5";
export type PadKey = "q" | "w" | "s" | "a";
export interface PadConfig {
  tone: PadTone;
  key: PadKey;
}
