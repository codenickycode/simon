import * as Tone from "tone";
import { NoteOctave } from "./types";
import { audioCtxReady } from "./audio-context";

export class MonoSynth {
  private synth = new Tone.Synth().toDestination();

  private previousTime = 0;

  async playNote({
    note,
    duration,
    time = Tone.getContext().currentTime, // play immediately,
  }: {
    note: NoteOctave;
    duration: number;
    time?: number;
  }) {
    await audioCtxReady;
    if (time === this.previousTime) {
      // prevent error of unknown origin where events get scheduled in the same tick
      return;
    }
    this.previousTime = time;
    try {
      // schedule a little in advance to prevent pops
      // https://github.com/Tonejs/Tone.js/wiki/Performance#scheduling-in-advance
      const attackTime = time + 0.004;
      this.synth.triggerAttackRelease(note, duration, attackTime);
    } catch (e) {
      console.error(e);
    }
  }
}
