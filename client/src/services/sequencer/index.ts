import * as Tone from "tone";
import { PadId } from "../../components/gamepad/types";
import { pads } from "../../components/gamepad/schema";
import { padToneToPadId } from "../../utils/pads";
import { MonoSynth } from "./mono-synth";

const INIT_NOTE_DURATION_S = 0.3;

class Sequencer {
  private transport = Tone.getTransport();
  private synth = new MonoSynth();

  // todo: allow tempo changes
  noteDurationS = INIT_NOTE_DURATION_S;
  noteDurationMs = INIT_NOTE_DURATION_S * 1000;

  private sequence = new Tone.Sequence((time, note) => {
    this.synth.playNote({ note, duration: this.noteDurationS, time });
    Tone.getDraw().schedule(() => {
      const padId = padToneToPadId(note);
      padId && this.onPlaySynthComputer(padId);
    }, time);
  }, []);

  constructor() {
    this.sequence.loop = false;
  }

  length = () => this.sequence.events.length;
  valueAt = (index: number) => this.sequence.events[index];

  /** Caller can set a callback which will fire whenever the computer plays a pad */
  setOnPlaySynthComputer(onPlaySynthComputer: (padId: PadId) => void) {
    this.onPlaySynthComputer = onPlaySynthComputer;
  }
  private onPlaySynthComputer: (padId: PadId) => void = () => {
    throw new Error("onPlaySynthComputer has not been initialized");
  };

  playSynthUser(padId: PadId) {
    this.stopSequence();
    this.synth.playNote({
      note: pads[padId].tone,
      duration: this.noteDurationS,
    });
  }

  addRandomNoteToSequence() {
    const tones = Object.values(pads).map((p) => p.tone);
    const index = Math.floor(Math.random() * 4);
    const padTone = tones[index];
    this.sequence.events.push(padTone);
  }

  resetSequence() {
    this.sequence.stop(0);
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
        this.transport.stop(Tone.now());
        res(undefined);
      }, sequenceDuration);
      this.sequence.start();
      this.transport.start();
    });
  }

  stopSequence() {
    this.transport.stop();
    this.transport.clear(this.sequenceCompleteId);
    this.transport.cancel(0);
  }
}

export const sequencer = new Sequencer();
