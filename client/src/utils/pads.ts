import { PAD_SCHEMA } from '../config';
import type { PadId, PadKey, PadTone } from '../types';
import type * as Tone from 'tone';

export const keyToPadId = (key: string): PadId | undefined => {
  const [padId] =
    Object.entries(PAD_SCHEMA).find(([, pad]) => pad.key === key) || [];
  // Object.entries is erasing the type of entries[0] which is the PadId
  return padId as PadId | undefined;
};
export const padKeyToPadTone = (key: PadKey): PadTone | undefined => {
  const pad = Object.values(PAD_SCHEMA).find((pad) => pad.key === key);
  return pad?.tone;
};
export const noteToPadId = (note: Tone.Unit.Frequency): PadId | undefined => {
  const [padId] =
    Object.entries(PAD_SCHEMA).find(([, pad]) => pad.tone === note) || [];
  if (!padId) {
    console.warn('could not find padId from note');
  }
  // Object.entries is erasing the type of entries[0] which is the PadId
  return padId as PadId | undefined;
};
export const padToneToPadKey = (tone: PadTone): PadKey | undefined => {
  const pad = Object.values(PAD_SCHEMA).find((pad) => pad.tone === tone);
  return pad?.key;
};
