import * as Tone from "tone";
import { PadId, PadTone } from "../components/Gamepad/types";
import { singleton } from "../utils/singleton";
import { pads } from "../components/Gamepad/schema";
import { padToneToPadId } from "../utils/pads";

const NOTE_DURATION_S = 0.3;

class Sequencer {
  private transport = Tone.getTransport();
  private synth = new Tone.Synth().toDestination();

  private sequence = this.initSequence();
  length = () => this.sequence.events.length;
  valueAt = (index: number) => this.sequence.events[index];

  private onPlayNote: (padId: PadId | undefined) => void = () => {
    throw new Error("onPlayNote has not been initialized");
  };
  setOnPlayNote(onPlayNote: (padId: PadId | undefined) => void) {
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

  addRandomNoteToSequence() {
    const tones = Object.values(pads).map((p) => p.tone);
    const index = Math.floor(Math.random() * 4);
    const padTone = tones[index];
    this.sequence.events.push(padTone);
  }

  resetSequence() {
    this.sequence.stop();
    this.sequence.clear();
    this.sequence.events = [];
  }

  private sequenceCompleteId = 0;
  /** plays the sequence and resolves when complete */
  async playSequence() {
    if (this.transport.state === "started") {
      // trying to prevent an error of unknown origin with this is called more than once
      return;
    }
    return new Promise((res) => {
      this.transport.clear(this.sequenceCompleteId);
      this.transport.position = 0;
      const sequenceDuration = this.sequence.events.length * NOTE_DURATION_S;
      this.sequenceCompleteId = this.transport.schedule(() => {
        this.transport.stop();
        res(undefined);
      }, sequenceDuration);
      this.sequence.start();
      this.transport.start();
    });
  }

  playNote(padTone: PadTone) {
    this.synth.triggerAttackRelease(
      padTone,
      NOTE_DURATION_S,
      Tone.getContext().currentTime // play immediately
    );
    const padId = padToneToPadId(padTone);
    this.onPlayNote(padId);
  }
}

export const getSequencer = () => singleton("sequencer", () => new Sequencer());
