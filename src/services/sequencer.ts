import * as Tone from "tone";
import { PadTone } from "../types/pad";
import { noOp } from "tone/build/esm/core/util/Interface";

type PromiseResolver = (value: void | PromiseLike<void>) => void;

export class Sequencer {
  private transport = Tone.getTransport();
  private synth = new Tone.Synth().toDestination();
  private onPlayNote: (note: PadTone | undefined) => void = noOp;
  private sequence = this.initSequence();

  private initSequence() {
    const sequence = new Tone.Sequence((time, note) => {
      if (note !== undefined) {
        this.synth.triggerAttackRelease(note, "0.3", time);
      }
      Tone.getDraw().schedule(() => {
        this.onPlayNote(note);
      }, time);
    }, []);
    sequence.loop = false;
    return sequence;
  }

  setOnPlayNote(onPlayNote: (note: PadTone | undefined) => void) {
    this.onPlayNote = onPlayNote;
  }

  addNoteToSequence(note: PadTone) {
    // pop undefined
    this.sequence.events.pop();
    this.sequence.events.push(note);
    // always add with undefined to deactivate the active pad
    this.sequence.events.push(undefined);
  }

  resetSequence() {
    this.sequence.stop();
    this.sequence.clear();
    this.sequence.events = [];
  }

  private sequencerComplete: Promise<void> = Promise.resolve(undefined);
  // @ts-expect-error we set it in the Promise body in the start method
  private sequencerCompleteResolver: PromiseResolver;

  async playSequence() {
    this.sequencerComplete = new Promise<void>(
      (res) => (this.sequencerCompleteResolver = res)
    );
    this.transport.stop();
    this.transport.position = 0;
    const sequenceDuration = this.sequence.events.length * 0.3; // 0.3 seconds per note
    // Schedule the end of the sequence
    this.transport.schedule(() => {
      // Stop the transport slightly after the last note
      this.transport.stop("+0.1");
      this.sequencerCompleteResolver();
    }, sequenceDuration);
    this.sequence.start();
    this.transport.start();
    return await this.sequencerComplete;
  }

  isStarted() {
    return this.transport.state === "started";
  }

  playNote(tone: PadTone) {
    this.synth.triggerAttackRelease(tone, "0.3");
    this.onPlayNote(tone);
  }
}
