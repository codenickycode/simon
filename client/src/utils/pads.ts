import { pads } from '../components/pad-controller/schema';
import type {
  PadId,
  PadKey,
  PadTone,
} from '../components/pad-controller/types';
import type { NoteOctave } from '../services/sequencer/types';

export const keyToPadId = (key: string): PadId | undefined => {
  const [padId] = Object.entries(pads).find(([, pad]) => pad.key === key) || [];
  // Object.entries is erasing the type of entries[0] which is the PadId
  return padId as PadId | undefined;
};
export const padKeyToPadTone = (key: PadKey): PadTone | undefined => {
  const pad = Object.values(pads).find((pad) => pad.key === key);
  return pad?.tone;
};
export const noteToPadId = (note: NoteOctave): PadId | undefined => {
  const [padId] =
    Object.entries(pads).find(([, pad]) => pad.tone === note) || [];
  if (!padId) {
    console.warn('could not find padId from note');
  }
  // Object.entries is erasing the type of entries[0] which is the PadId
  return padId as PadId | undefined;
};
export const padToneToPadKey = (tone: PadTone): PadKey | undefined => {
  const pad = Object.values(pads).find((pad) => pad.tone === tone);
  return pad?.key;
};
