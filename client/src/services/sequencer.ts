import * as Tone from 'tone';
import { randomIndex } from '../utils/array';

export interface SequencerNoteEvent {
  detail: {
    note: Tone.Unit.Frequency;
  };
}

const sequenceSynth = new Tone.Synth().toDestination();

const SEQ_NOTE_LENGTH = '8n';

class Sequencer extends EventTarget {
  private _transport = Tone.getTransport();

  NOTE_EVENT = 'sequencerNoteEvent';

  get noteDuration() {
    return {
      s: Tone.Time(SEQ_NOTE_LENGTH).toSeconds(),
      ms: Tone.Time(SEQ_NOTE_LENGTH).toMilliseconds(),
    };
  }

  constructor() {
    super();
    this._sequence.loop = false;
    // we start our sequence at 0,
    // and use transport start/stop for playback
    this._sequence.start(0);
  }

  private _sequence = new Tone.Sequence((time, note) => {
    sequenceSynth.triggerAttackRelease(note, SEQ_NOTE_LENGTH, time);
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

  addRandomNote(notes: Tone.Unit.Frequency[]) {
    const index = randomIndex(notes);
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
