import * as Tone from 'tone';
import type { Duration, NoteOctave } from './synth.types';

export class MonoSynth {
  private _synth;

  constructor(synth: Tone.Synth<Tone.SynthOptions> = new Tone.Synth()) {
    this._synth = synth;
    this._synth.toDestination();
  }

  async playNote({
    note,
    duration,
    time = Tone.getContext().currentTime, // play immediately,
  }: {
    note: NoteOctave;
    duration: Duration;
    time?: number;
  }) {
    try {
      // schedule a little in advance to prevent pops
      // https://github.com/Tonejs/Tone.js/wiki/Performance#scheduling-in-advance
      const attackTime = time + 0.004;
      this._synth.triggerAttackRelease(note, duration, attackTime);
    } catch (e) {
      console.error(e);
    }
  }
}
