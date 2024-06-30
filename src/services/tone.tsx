import * as Tone from "tone";
import { PadTone } from "../types/pad";

const synth = new Tone.Synth().toDestination();

export function playTone(tone: PadTone) {
  synth.triggerAttackRelease(tone, "0.3");
}

export function isSequenceStarted() {
  return Tone.getTransport().state === "started";
}

const notes: PadTone[] = ["E4", "E4", "C#4", "A4"];

export const game = { seq: new Tone.Sequence() };

export const initSeq = (onDraw: (note: PadTone | undefined) => void) => {
  game.seq = new Tone.Sequence(
    (time, note) => {
      if (note !== undefined) {
        synth.triggerAttackRelease(note, "0.3", time);
      }
      // Schedule state updates to coincide with audio playback
      Tone.getDraw().schedule(() => {
        onDraw(note);
      }, time);
    },
    [...notes, undefined]
  );
  game.seq.loop = false;
  const sequenceDuration = game.seq.events.length * 0.3; // 0.3 seconds per note
  const transport = Tone.getTransport();
  // Schedule the end of the sequence
  transport.schedule(() => {
    // Stop the transport slightly after the last note
    transport.stop("+0.1");
  }, sequenceDuration);
};

export function start() {
  const transport = Tone.getTransport();
  transport.stop();
  transport.position = 0;
  game.seq.start();
  transport.start();
}
