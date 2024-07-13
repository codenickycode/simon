import { PadTone } from "../../types/pad";
import { delay } from "../../utils/delay";
import { getSequencer } from "../sequencer";

/** A generic buffer to prevent feedback from happening to quickly for user */
const TIMING_BUFFER_MS = 500;

export const gameLogic = {
  checkInput: (pad: PadTone, currentIndex: number): boolean => {
    return pad === getSequencer().valueAt(currentIndex);
  },
  isSequenceComplete: (currentIndex: number): boolean => {
    return currentIndex !== 0 && currentIndex === getSequencer().length();
  },
  nextSequence: async () => {
    getSequencer().addRandomNoteToSequence();
    // play sequence after a short delay to ensure all is scheduled
    return delay(TIMING_BUFFER_MS, () => getSequencer().playSequence());
  },
};
