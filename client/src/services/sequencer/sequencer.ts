import * as Tone from 'tone';
import { MonoSynth } from './mono-synth';
import type { NoteOctave } from './types';
import { melodies, MELODY_LENGTH_MS } from './melodies';
import { delay } from '../../utils/delay';

const INIT_NOTE_DURATION_S = 0.3;

class Sequencer {
  private transport = Tone.getTransport();

  // todo: allow tempo changes
  get noteDurationS() {
    return INIT_NOTE_DURATION_S;
  }
  get noteDurationMs() {
    return INIT_NOTE_DURATION_S * 1000;
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
        this.stopSequence();
        this._synths.user.playNote({
          note,
          duration: this.noteDurationS,
        });
      },
    },
  };

  private sequence = new Tone.Sequence((time, note) => {
    this._synths.sequence.playNote({
      note,
      duration: this.noteDurationS,
      time,
    });
    Tone.getDraw().schedule(() => {
      this._synths.sequence.notify(note);
    }, time);
  }, []);

  constructor() {
    this.sequence.loop = false;
    // we start our sequence at 0,
    // and use transport start/stop for playback
    this.sequence.start(0);
  }

  get sequenceLength() {
    return this.sequence.events.length;
  }
  valueAt(index: number) {
    return this.sequence.events[index];
  }

  addRandomNoteToSequence(notes: NoteOctave[]) {
    const index = Math.floor(Math.random() * notes.length);
    const note = notes[index];
    this.sequence.events.push(note);
  }

  resetSequence() {
    this.sequence.clear();
    this.sequence.events = [];
  }

  private sequenceCompleteId = 0;

  /** plays the sequence and resolves when complete */
  async playSequence() {
    this.stopSequence();
    return new Promise((res) => {
      const sequenceDuration = this.sequenceLength * this.noteDurationS;
      this.sequenceCompleteId = this.transport.schedule(() => {
        this.stopSequence();
        res(undefined);
      }, sequenceDuration);
      // best to start the transport a little late
      // https://github.com/Tonejs/Tone.js/wiki/Performance#scheduling-in-advance
      this.transport.start('+0.1');
    });
  }

  async playMelody(melody: keyof typeof melodies) {
    // this effectively stops the sequencer if playing
    this.sequence.mute = true;
    this._synths.sequence.mute();
    // let the last note trail off a bit before playing
    await delay(this.noteDurationMs / 3);
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
      this.sequence.mute = false;
    });
  }

  stopSequence() {
    this.transport.stop(Tone.now());
    this.transport.clear(this.sequenceCompleteId);
    this.transport.position = 0;
  }
}

export const sequencer = new Sequencer();
