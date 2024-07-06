import * as Tone from "tone";
import { PadTone } from "../types/pad";

const NOTE_DURATION_S = 0.3;
export const TIMING_BUFFER_MS = 500;

class Sequencer {
  private transport = Tone.getTransport();
  private synth = new Tone.Synth().toDestination();

  private sequence = this.initSequence();
  length = () => this.sequence.events.length;
  valueAt = (index: number) => this.sequence.events[index];

  private onPlayNote: (note: PadTone | undefined) => void = () => {
    throw new Error("onPlayNote has not been initialized");
  };
  setOnPlayNote(onPlayNote: (note: PadTone | undefined) => void) {
    this.onPlayNote = onPlayNote;
  }

  private initSequence() {
    const sequence = new Tone.Sequence((time, note) => {
      this.synth.triggerAttackRelease(note, NOTE_DURATION_S, time);
      Tone.getDraw().schedule(() => {
        this.onPlayNote(note);
      }, time);
    }, []);
    sequence.loop = false;
    return sequence;
  }

  addNoteToSequence(note: PadTone) {
    this.sequence.events.push(note);
  }

  resetSequence() {
    this.sequence.stop();
    this.sequence.clear();
    this.sequence.events = [];
  }

  private sequenceCompleteId = 0;
  /** plays the sequence and resolves when complete */
  async playSequence() {
    return new Promise((res) => {
      this.transport.clear(this.sequenceCompleteId);
      this.transport.position = 0;
      const sequenceDuration = this.sequence.events.length * NOTE_DURATION_S;
      this.sequenceCompleteId = this.transport.schedule(() => {
        res(undefined);
      }, sequenceDuration);
      this.sequence.start();
      this.transport.start();
    });
  }

  playNote(tone: PadTone) {
    this.synth.triggerAttackRelease(
      tone,
      NOTE_DURATION_S,
      Tone.getContext().currentTime // play immediately
    );
    this.onPlayNote(tone);
  }
}

export const sequencer = new Sequencer();
