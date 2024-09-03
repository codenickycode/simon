import * as Tone from 'tone';
import { melodies } from './melody-player.melodies';
import { delay } from '../utils/delay';

const TIMING_BUFFER = 100;

const melodySynth = new Tone.Synth({
  oscillator: { type: 'amsquare16' },
  volume: -3,
}).toDestination();

export const melodyPlayer = {
  play: async (melody: keyof typeof melodies) => {
    // let any last note trail off a bit before playing
    await delay(TIMING_BUFFER);
    const melodyNotes = melodies[melody];
    let time = Tone.now();
    for (const { note, duration } of melodyNotes) {
      melodySynth.triggerAttackRelease(note, duration, time);
      time += Tone.Time(duration).toSeconds();
    }
  },
};
