import { pads } from "../../components/gamepad/schema";
import { PadId } from "../../components/gamepad/types";
import { delay } from "../../utils/delay";
import { sequencer } from "../sequencer";
import { GameMachineState } from "./types";

/** A generic buffer to prevent feedback from happening to quickly for user */
const TIMING_BUFFER_MS = 500;

export const NEW_GAME_STATE: GameMachineState = {
  state: "newGame",
  userSeqIndex: 0,
  userScore: 0,
};

export const gameLogic = {
  checkInput: (padId: PadId, currentIndex: number): boolean => {
    return pads[padId].tone === sequencer.valueAt(currentIndex);
  },
  isSequenceComplete: (currentIndex: number): boolean => {
    return currentIndex !== 0 && currentIndex === sequencer.sequenceLength;
  },
  nextSequence: async () => {
    sequencer.addRandomNoteToSequence(Object.values(pads).map((p) => p.tone));
    // play sequence after a short delay to ensure all is scheduled
    return delay(TIMING_BUFFER_MS, () => sequencer.playSequence());
  },
};
