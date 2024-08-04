import * as Tone from 'tone';
import { MonoSynth } from './mono-synth';
export type * from './types';

export const sequenceSynth = new MonoSynth(new Tone.Synth());
export const userSynth = new MonoSynth(new Tone.Synth());
export const melodySynth = new MonoSynth(
  new Tone.Synth({ oscillator: { type: 'amsquare16' }, volume: -3 }),
);
