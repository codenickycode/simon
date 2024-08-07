import * as Tone from 'tone';
import type { Duration, NoteOctave } from './types';
import { audioCtxReady } from './audio-context';
import { SimpleObservable } from '../../utils/observable';

export class MonoSynth extends SimpleObservable<NoteOctave> {
  private _synth;
  private _volume;

  constructor(synth: Tone.Synth<Tone.SynthOptions> = new Tone.Synth()) {
    super();
    this._synth = synth;
    this._volume = this._synth.volume.value;
    this._synth.toDestination();
  }

  private previousTime = 0;

  async playNote({
    note,
    duration,
    time = Tone.getContext().currentTime, // play immediately,
  }: {
    note: NoteOctave;
    duration: Duration;
    time?: number;
  }) {
    await audioCtxReady;
    if (time === this.previousTime) {
      // prevent error of unknown origin where events get scheduled in the same tick
      return;
    }
    this.previousTime = time;
    try {
      // schedule a little in advance to prevent pops
      // https://github.com/Tonejs/Tone.js/wiki/Performance#scheduling-in-advance
      const attackTime = time + 0.004;
      this._synth.triggerAttackRelease(note, duration, attackTime);
    } catch (e) {
      console.error(e);
    }
  }

  mute() {
    this._volume = this._synth.volume.value;
    this._synth.volume.rampTo(-Infinity, 0.004);
  }

  unMute() {
    this._synth.volume.rampTo(this._volume, 0.004);
  }
}
