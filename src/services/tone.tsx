import * as Tone from "tone";
import { PAD_TONES, PadColor, PadTone } from "../types/pad";

const synth = new Tone.Synth().toDestination();

export function playTone(color: PadColor) {
  synth.triggerAttackRelease(PAD_TONES[color], "0.3");
}

const notes: PadTone[] = ["E4", "E4", "C#4"];

export const game = { seq: new Tone.Sequence() };

export const initSeq = (onDraw: (note: PadTone | undefined) => void) => {
  game.seq = new Tone.Sequence(
    (time, note) => {
      if (note !== undefined) synth.triggerAttackRelease(note, "0.3", time);
      // Schedule state updates to coincide with audio playback
      Tone.getDraw().schedule(() => {
        onDraw(note);
      }, time);
    },
    [...notes, undefined]
  );
  game.seq.loop = false;
};

export function start() {
  const transport = Tone.getTransport();
  transport.stop();
  transport.position = 0;
  game.seq.start();
  transport.start();
}
