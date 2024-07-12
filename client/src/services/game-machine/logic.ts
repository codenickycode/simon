import { PadTone } from "../../types/pad";
import { delay } from "../../utils/delay";
import { sequencer } from "../sequencer";

/** A generic buffer to prevent feedback from happening to quickly for user */
const TIMING_BUFFER_MS = 500;
/** How long to display game over screen before transitioning back to idle */
const GAME_OVER_DISPLAY_MS = 2000;

export const gameLogic = {
  /** Checks if the user's input matches the value at the sequence index */
  checkInput: (pad: PadTone, currentIndex: number): boolean => {
    return pad === sequencer.valueAt(currentIndex);
  },
  /** Checks if user has completed the current sequence */
  isSequenceComplete: (currentIndex: number): boolean => {
    return currentIndex !== 0 && currentIndex === sequencer.length();
  },
  /** Adds a new note and plays the entire sequence */
  nextSequence: async () => {
    sequencer.addRandomNoteToSequence();
    // play sequence after a short delay to ensure all is scheduled
    return delay(TIMING_BUFFER_MS, sequencer.playSequence);
  },
  /** Displays the game over screen for a time, then returns to idle status */
  displayGameOver: async () => {
    return delay(GAME_OVER_DISPLAY_MS);
  },
};
