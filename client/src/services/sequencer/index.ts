import * as Tone from "tone";
import { PadId } from "../../components/gamepad/types";
import { pads } from "../../components/gamepad/schema";
import { padToneToPadId } from "../../utils/pads";

const INIT_NOTE_DURATION_S = 0.3;

class Sequencer {
  private transport = Tone.getTransport();
  private synth = new Tone.Synth({
    envelope: {
      attack: 0.004,
    },
  }).toDestination();

  private sequence = this.initSequence();
  length = () => this.sequence.events.length;
  valueAt = (index: number) => this.sequence.events[index];

  // todo: allow tempo changes
  noteDurationS = INIT_NOTE_DURATION_S;
  noteDurationMs = INIT_NOTE_DURATION_S * 1000;

  private onPlayPadTone: (padId: PadId) => void = () => {
    throw new Error("onPlayPadTone has not been initialized");
  };
  setOnPlayPadTone(onPlayPadTone: (padId: PadId) => void) {
    this.onPlayPadTone = onPlayPadTone;
  }

  private initSequence() {
    const sequence = new Tone.Sequence((time, tone) => {
      this.synth.triggerAttackRelease(tone, this.noteDurationS, time);
      Tone.getDraw().schedule(() => {
        const padId = padToneToPadId(tone);
        padId && this.onPlayPadTone(padId);
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

  // @ts-expect-error it is defined immediately after when creating the promise
  audioReadyResolver: (value: unknown) => void;
  audioReady = new Promise((res) => (this.audioReadyResolver = res));
  previousTime = 0;

  async playPadTone(padId: PadId) {
    await this.audioReady;
    const time = Tone.getContext().currentTime; // play immediately
    if (time === this.previousTime) {
      // prevent error of unknown origin where events get scheduled in the same tick
      return;
    }
    this.previousTime = time;
    try {
      this.synth.triggerAttackRelease(
        pads[padId].tone,
        this.noteDurationS,
        time
      );
    } catch (e) {
      console.error(e);
    }
  }
}

export const sequencer = new Sequencer();

/** Due to auto-play policy on chrome, the audio context can only be started on
 * a user interaction. These events are considered a user interaction. */
const initialClick = async () => {
  await Tone.start();
  console.log("audio is ready");
  document.removeEventListener("keydown", initialClick);
  document.removeEventListener("touchend", initialClick);
  document.removeEventListener("click", initialClick);
  sequencer.audioReadyResolver(0);
};
document.addEventListener("keydown", initialClick);
document.addEventListener("touchend", initialClick);
document.addEventListener("click", initialClick);
