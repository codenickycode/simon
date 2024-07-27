import * as Tone from "tone";
import { MonoSynth } from "./mono-synth";
import type { NoteOctave } from "./types";

const INIT_NOTE_DURATION_S = 0.3;

class Sequencer {
  private transport = Tone.getTransport();
  private synth = new MonoSynth();

  // todo: allow tempo changes
  get noteDurationS() {
    return INIT_NOTE_DURATION_S;
  }
  get noteDurationMs() {
    return INIT_NOTE_DURATION_S * 1000;
  }

  private sequence = new Tone.Sequence((time, note) => {
    this.synth.playNote({ note, duration: this.noteDurationS, time });
    Tone.getDraw().schedule(() => {
      this.onPlaySynthComputer(note);
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

  /** Caller can set a callback which will fire whenever the computer plays a note */
  setOnPlaySynthComputer(onPlaySynthComputer: (note: NoteOctave) => void) {
    this.onPlaySynthComputer = onPlaySynthComputer;
  }
  private onPlaySynthComputer: (note: NoteOctave) => void = () => {
    throw new Error("onPlaySynthComputer has not been initialized");
  };

  playSynthUser(note: NoteOctave) {
    this.stopSequence();
    this.synth.playNote({
      note,
      duration: this.noteDurationS,
    });
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
      this.transport.start("+0.1");
    });
  }

  stopSequence() {
    this.transport.stop(Tone.now());
    this.transport.clear(this.sequenceCompleteId);
    this.transport.position = 0;
  }
}

export const sequencer = new Sequencer();
