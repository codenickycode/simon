import * as Tone from 'tone';
import { melodies } from './melody-player.melodies';
import { delay } from '../utils/delay';
import { MonoSynth } from './synth.mono-synth';

const TIMING_BUFFER = 100;

const melodySynth = new MonoSynth(
  new Tone.Synth({ oscillator: { type: 'amsquare16' }, volume: -3 }),
);

export const melodyPlayer = {
  play: async (melody: keyof typeof melodies) => {
    // let any last note trail off a bit before playing
    await delay(TIMING_BUFFER);
    const melodyNotes = melodies[melody];
    const now = Tone.now();
    for (const { note, duration, offset } of melodyNotes) {
      melodySynth.playNote({
        note,
        duration,
        time: now + offset,
      });
    }
  },
};
