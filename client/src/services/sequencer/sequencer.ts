import * as Tone from 'tone';
import type { NoteOctave } from '../synth';
import { melodies } from './melodies';
import { delay } from '../../utils/delay';
import { MonoSynth } from '../synth/mono-synth';

const sequenceSynth = new MonoSynth(new Tone.Synth());
const melodySynth = new MonoSynth(
  new Tone.Synth({ oscillator: { type: 'amsquare16' }, volume: -3 }),
);

const INIT_NOTE_DURATION_S = 0.3;

class Sequencer {
  private _transport = Tone.getTransport();

  public synth = {
    subscribe: sequenceSynth.subscribe,
  };

  // todo: allow tempo changes
  get noteDuration() {
    return { s: INIT_NOTE_DURATION_S, ms: INIT_NOTE_DURATION_S * 1000 };
  }

  constructor() {
    this._sequence.loop = false;
    // we start our sequence at 0,
    // and use transport start/stop for playback
    this._sequence.start(0);
  }

  private _sequence = new Tone.Sequence((time, note) => {
    sequenceSynth.playNote({
      note,
      duration: this.noteDuration.s,
      time,
    });
    Tone.getDraw().schedule(() => {
      sequenceSynth.notify(note);
    }, time);
  }, []);

  get length() {
    return this._sequence.events.length;
  }

  valueAt(index: number) {
    return this._sequence.events[index];
  }

  addRandomNote(notes: NoteOctave[]) {
    const index = Math.floor(Math.random() * notes.length);
    const note = notes[index];
    this._sequence.events.push(note);
  }

  private _sequenceCompleteId = 0;

  /** plays the sequence and resolves when complete */
  async playSequence() {
    this.stopSequence();
    return new Promise((res) => {
      const sequenceDuration = this.length * this.noteDuration.s;

      this._sequenceCompleteId = this._transport.schedule(
        () => {
          this.stopSequence();
          res(undefined);
        },
        // resolve after the sequence duration, but take a little off since
        // we'll consider the sequence done while the last note is releasing
        sequenceDuration - this.noteDuration.s / 2,
      );
      // best to start the transport a little late
      // https://github.com/Tonejs/Tone.js/wiki/Performance#scheduling-in-advance
      this._transport.start('+0.1');
    });
  }

  stopSequence() {
    this._transport.stop(Tone.now());
    this._transport.clear(this._sequenceCompleteId);
    this._transport.position = 0;
  }

  resetSequence() {
    this._sequence.clear();
    this._sequence.events = [];
  }

  async playMelody(melody: keyof typeof melodies) {
    // let any last note trail off a bit before playing
    await delay(this.noteDuration.ms / 3);
    const melodyNotes = melodies[melody];
    const now = Tone.now();
    for (const { note, duration, offset } of melodyNotes) {
      melodySynth.playNote({
        note,
        duration,
        time: now + offset,
      });
    }
  }
}

export const sequencer = new Sequencer();
