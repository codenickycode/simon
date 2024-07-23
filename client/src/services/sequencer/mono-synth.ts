import * as Tone from "tone";
import { noOp } from "../../utils/no-op";
import { Note } from "./types";

export class MonoSynth {
  private synth = new Tone.Synth({
    envelope: {
      attack: 0.004,
    },
  }).toDestination();

  constructor() {
    document.addEventListener("keydown", this.startAudioContext);
    document.addEventListener("touchend", this.startAudioContext);
    document.addEventListener("click", this.startAudioContext);
  }

  /** Due to auto-play policy on chrome, the audio context can only be started on
   * a user interaction. These events are considered a user interaction. */
  private startAudioContext = async () => {
    await Tone.start();
    console.log("audio is ready");
    document.removeEventListener("keydown", this.startAudioContext);
    document.removeEventListener("touchend", this.startAudioContext);
    document.removeEventListener("click", this.startAudioContext);
    this.audioReadyResolver(0);
  };

  private audioReadyResolver: (value: unknown) => void = noOp; // noOp is a placeholder
  private audioReady = new Promise((res) => (this.audioReadyResolver = res));
  private previousTime = 0;

  async playNote({
    note,
    duration,
    time = Tone.getContext().currentTime, // play immediately,
  }: {
    note: Note;
    duration: number;
    time?: number;
  }) {
    await this.audioReady;
    if (time === this.previousTime) {
      // prevent error of unknown origin where events get scheduled in the same tick
      return;
    }
    this.previousTime = time;
    try {
      this.synth.triggerAttackRelease(note, duration, time);
    } catch (e) {
      console.error(e);
    }
  }
}
