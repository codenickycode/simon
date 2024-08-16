import * as Tone from 'tone';
import type { NoteOctave } from '../synth';
import { MonoSynth } from '../synth/mono-synth';
import type { NoOp } from '../../utils/no-op';

export interface SequencerNoteEvent {
  detail: {
    note: NoteOctave;
  };
}

const sequenceSynth = new MonoSynth(new Tone.Synth());

const INIT_NOTE_DURATION_S = 0.3;

class Sequencer extends EventTarget {
  private _transport = Tone.getTransport();

  private NOTE_EVENT = 'sequencerNoteEvent';

  public synth = {
    addNoteEventListener: (cb: NoOp) => {
      this.addEventListener(this.NOTE_EVENT, cb);
      return () => this.removeEventListener(this.NOTE_EVENT, cb);
    },
  };

  // todo: allow tempo changes
  get noteDuration() {
    return { s: INIT_NOTE_DURATION_S, ms: INIT_NOTE_DURATION_S * 1000 };
  }

  constructor() {
    super();
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
      this.dispatchEvent(
        new CustomEvent(this.NOTE_EVENT, { detail: { note } }),
      );
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
  async play() {
    this.stop();
    return new Promise((res) => {
      const sequenceDuration = this.length * this.noteDuration.s;

      this._sequenceCompleteId = this._transport.schedule(
        () => {
          this.stop();
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

  stop() {
    this._transport.stop(Tone.now());
    this._transport.clear(this._sequenceCompleteId);
    this._transport.position = 0;
  }

  reset() {
    this._sequence.clear();
    this._sequence.events = [];
  }
}

export const sequencer = new Sequencer();
