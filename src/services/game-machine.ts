import { useMemo } from "react";
import { setup, raise, fromPromise } from "xstate";
import { useMachine } from "@xstate/react";
import { PADS, PadTone } from "../types/pad";
import { Sequencer } from "./sequencer";

interface GameContext {
  i: number;
  sequence: PadTone[];
  highScore: number;
}

export type GameEvent =
  | { type: "sequenceComplete" }
  | { type: "start" }
  | { type: "input"; value: PadTone };

export interface GuardType {
  context: GameContext;
  event: GameEvent;
}

export const useGameMachine = (sequencer: Sequencer) => {
  const machine = useMemo(() => setupMachine(sequencer), [sequencer]);
  return useMachine(machine);
};

const setupMachine = (sequencer: Sequencer) => {
  return setup({
    types: {
      context: {} as GameContext,
      events: {} as GameEvent,
    },
    actions: {
      // we have to declare this type once and then the rest of the actions are typed 🤷
      addToSequence: ({ context }: { context: GameContext }) => {
        const tones = Object.values(PADS).map((p) => p.tone);
        const index = Math.floor(Math.random() * 4);
        const padTone = tones[index];
        // TODO: Do we need both context and tone sequence?
        context.sequence.push(padTone);
        sequencer.addNoteToSequence(padTone);
      },
      checkHighScore: ({ context }) => {
        // the user failed to enter the last value
        const userScore = context.sequence.length - 1;
        if (userScore > context.highScore) {
          context.highScore = userScore;
        }
      },
      resetSequence: ({ context }) => {
        // TODO: Do we need both context and tone sequence?
        context.sequence = [];
        sequencer.resetSequence();
      },
      resetI: ({ context }) => {
        context.i = 0;
      },
      playNote: ({ event }) => {
        event.type === "input" && sequencer.playNote(event.value);
      },
      input: ({ context, event }) => {
        event.type === "input" && sequencer.playNote(event.value);
        context.i++;
        if (context.i === context.sequence.length) {
          raise({ type: "sequenceComplete" });
        }
      },
    },
    actors: {
      playSequence: fromPromise(async () => await sequencer.playSequence()),
    },
    guards: {
      correct: ({ context, event }: GuardType) => {
        if (
          event.type === "input" &&
          event.value === context.sequence[context.i]
        ) {
          return true;
        }
        return false;
      },
      checkComplete: ({ context }) => {
        return context.i === context.sequence.length;
      },
    },
  }).createMachine({
    context: {
      i: 0,
      sequence: [],
      highScore: 0,
    },
    id: "game",
    initial: "idle",
    states: {
      idle: {
        on: {
          start: {
            target: "playing",
          },
          input: {
            actions: {
              type: "playNote",
            },
          },
        },
        description: "Display high score",
      },
      playing: {
        initial: "computerTurn",
        states: {
          computerTurn: {
            entry: {
              type: "addToSequence",
            },
            invoke: {
              id: "sequencer",
              input: {},
              onDone: {
                target: "userTurn",
              },
              src: "playSequence",
            },
          },
          userTurn: {
            initial: "idle",
            on: {
              sequenceComplete: {
                target: "computerTurn",
              },
            },
            exit: {
              type: "resetI",
            },
            states: {
              idle: {
                on: {
                  input: [
                    {
                      target: "checkComplete",
                      actions: {
                        type: "input",
                      },
                      guard: {
                        type: "correct",
                      },
                    },
                    {
                      target: "#game.gameover",
                    },
                  ],
                },
              },
              checkComplete: {
                always: [
                  {
                    target: "#game.playing.computerTurn",
                    guard: "checkComplete",
                  },
                  {
                    target: "idle",
                  },
                ],
              },
            },
          },
        },
      },
      gameover: {
        after: {
          "2000": {
            target: "#game.idle",
          },
        },
        entry: {
          type: "checkHighScore",
        },
        exit: {
          type: "resetSequence",
        },
      },
    },
  });
};
