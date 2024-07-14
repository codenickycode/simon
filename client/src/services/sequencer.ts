import * as Tone from "tone";
import { PadId } from "../components/Gamepad/types";
import { singleton } from "../utils/singleton";
import { pads } from "../components/Gamepad/schema";
import { padToneToPadId } from "../utils/pads";

const INIT_NOTE_DURATION_S = 0.3;

class Sequencer {
  private transport = Tone.getTransport();
  private synth = new Tone.Synth().toDestination();

  private sequence = this.initSequence();
  length = () => this.sequence.events.length;
  valueAt = (index: number) => this.sequence.events[index];

  // todo: allow tempo changes
  noteDurationS = INIT_NOTE_DURATION_S;
  noteDurationMs = INIT_NOTE_DURATION_S * 1000;

  private onPlayPadTone: (padId: PadId | undefined) => void = () => {
    throw new Error("onPlayPadTone has not been initialized");
  };
  setOnPlayPadTone(onPlayPadTone: (padId: PadId | undefined) => void) {
    this.onPlayPadTone = onPlayPadTone;
  }

  private initSequence() {
    const sequence = new Tone.Sequence((time, tone) => {
      this.synth.triggerAttackRelease(tone, this.noteDurationS, time);
      Tone.getDraw().schedule(() => {
        const padId = padToneToPadId(tone);
        this.onPlayPadTone(padId);
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
      const sequenceDuration = this.sequence.events.length * this.noteDurationS;
      this.sequenceCompleteId = this.transport.schedule(() => {
        this.transport.stop();
        res(undefined);
      }, sequenceDuration);
      this.sequence.start();
      this.transport.start();
    });
  }

  stopSequence() {
    this.transport.stop();
    this.transport.clear(this.sequenceCompleteId);
  }

  playPadTone(padId: PadId) {
    try {
      this.synth.triggerAttackRelease(
        pads[padId].tone,
        this.noteDurationS,
        Tone.getContext().currentTime // play immediately
      );
    } catch (e) {
      console.error(e);
      // ignore it!
    }
  }
}

export const getSequencer = () => singleton("sequencer", () => new Sequencer());
