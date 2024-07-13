export type PadId = "green" | "red" | "blue" | "yellow";
export type PadTone = "E4" | "C#4" | "E5" | "A4";
export type PadKey = "q" | "w" | "s" | "a";
export interface PadConfig {
  tone: PadTone;
  key: PadKey;
  bgColor: string;
  bgActiveColor: string;
  borderRadius: string;
}

// it's better for padId to be a string here for convenience
export type ActivePads = Record<string, boolean | undefined>;
