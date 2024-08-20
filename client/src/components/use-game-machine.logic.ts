import { PAD_SCHEMA } from '../config';
import { sequencer } from '../services/sequencer';
import { PadId } from '../types';
import { delay } from '../utils/delay';
import type { GameMachineState } from './use-game-machine.types';

/** A generic buffer to prevent feedback from happening to quickly for user */
const TIMING_BUFFER_MS = 500;

export const NEW_GAME_STATE: GameMachineState = {
  state: 'newGame',
  userSeqIndex: 0,
  userScore: 0,
};

export const gameLogic = {
  checkInput: (padId: PadId, currentIndex: number): boolean => {
    return PAD_SCHEMA[padId].tone === sequencer.valueAt(currentIndex);
  },
  isSequenceComplete: (currentIndex: number): boolean => {
    return currentIndex !== 0 && currentIndex === sequencer.length;
  },
  nextSequence: async () => {
    sequencer.addRandomNote(Object.values(PAD_SCHEMA).map((p) => p.tone));
    // play sequence after a short delay to ensure all is scheduled
    return delay(TIMING_BUFFER_MS, () => sequencer.play());
  },
};
