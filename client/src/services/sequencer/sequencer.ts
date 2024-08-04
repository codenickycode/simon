import * as Tone from 'tone';
import { MonoSynth } from './mono-synth';
import type { NoteOctave } from './types';
import { melodies, MELODY_LENGTH_MS } from './melodies';
import { delay } from '../../utils/delay';

const INIT_NOTE_DURATION_S = 0.3;

class Sequencer {
  private _transport = Tone.getTransport();

  // todo: allow tempo changes
  get noteDuration() {
    return { s: INIT_NOTE_DURATION_S, ms: INIT_NOTE_DURATION_S * 1000 };
  }

  private _synths = {
    sequence: new MonoSynth(new Tone.Synth()),
    user: new MonoSynth(new Tone.Synth()),
    melody: new MonoSynth(
      new Tone.Synth({ oscillator: { type: 'amsquare16' }, volume: -3 }),
    ),
  };
  public synths = {
    sequence: {
      subscribe: this._synths.sequence.subscribe,
    },
    user: {
      playNote: (note: NoteOctave) => {
        this.sequence.stop();
        this._synths.user.playNote({
          note,
          duration: this.noteDuration.s,
        });
      },
    },
  };

  constructor() {
    this._sequence.loop = false;
    // we start our sequence at 0,
    // and use transport start/stop for playback
    this._sequence.start(0);
  }
  private _sequence = new Tone.Sequence((time, note) => {
    this._synths.sequence.playNote({
      note,
      duration: this.noteDuration.s,
      time,
    });
    Tone.getDraw().schedule(() => {
      this._synths.sequence.notify(note);
    }, time);
  }, []);

  private _sequenceCompleteId = 0;

  public sequence = {
    length: () => this._sequence.events.length,
    valueAt: (index: number) => {
      return this._sequence.events[index];
    },
    addRandomNote: (notes: NoteOctave[]) => {
      const index = Math.floor(Math.random() * notes.length);
      const note = notes[index];
      this._sequence.events.push(note);
    },
    reset: () => {
      this._sequence.clear();
      this._sequence.events = [];
    },
    /** plays the sequence and resolves when complete */
    play: async () => {
      this.sequence.stop();
      return new Promise((res) => {
        const sequenceDuration = this.sequence.length() * this.noteDuration.s;
        this._sequenceCompleteId = this._transport.schedule(() => {
          this.sequence.stop();
          res(undefined);
        }, sequenceDuration);
        // best to start the transport a little late
        // https://github.com/Tonejs/Tone.js/wiki/Performance#scheduling-in-advance
        this._transport.start('+0.1');
      });
    },
    stop: () => {
      this._transport.stop(Tone.now());
      this._transport.clear(this._sequenceCompleteId);
      this._transport.position = 0;
    },
  };

  async playMelody(melody: keyof typeof melodies) {
    // this effectively stops the sequencer if playing
    this._sequence.mute = true;
    this._synths.sequence.mute();
    // let the last note trail off a bit before playing
    await delay(this.noteDuration.ms / 3);
    const melodyNotes = melodies[melody];
    const now = Tone.now();
    for (const { note, duration, offset } of melodyNotes) {
      this._synths.melody.playNote({
        note,
        duration,
        time: now + offset,
      });
    }
    // unmute the sequencer for next playback
    delay(MELODY_LENGTH_MS, () => {
      this._synths.sequence.unMute();
      this._sequence.mute = false;
    });
  }
}

export const sequencer = new Sequencer();
