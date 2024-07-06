import { fromPromise, setup } from "xstate";
import { GameContext, GameEvent } from "./types";
import { PADS } from "../../types/pad";
import { sequencer, TIMING_BUFFER_MS } from "../sequencer";

export const setupStateMachine = () => {
  return setup({
    types: {
      context: {} as GameContext,
      events: {} as GameEvent,
    },
    actions: {
      addToSequence: () => {
        const tones = Object.values(PADS).map((p) => p.tone);
        const index = Math.floor(Math.random() * 4);
        const padTone = tones[index];
        sequencer.addNoteToSequence(padTone);
      },
      resetSequence: () => {
        sequencer.resetSequence();
      },
      resetI: ({ context }) => {
        context.i = 0;
      },
      playNote: ({ event }) => {
        event.type === "padDown" && sequencer.playNote(event.value);
      },
      padDown: ({ context, event }) => {
        event.type === "padDown" && sequencer.playNote(event.value);
        context.i++;
        if (context.i > context.highScore) {
          context.highScore = context.i;
        }
      },
    },
    actors: {
      playSequence: fromPromise(async () => await sequencer.playSequence()),
    },
    guards: {
      correct: ({ context, event }) => {
        if (
          event.type === "padDown" &&
          event.value === sequencer.valueAt(context.i)
        ) {
          return true;
        }
        return false;
      },
      checkComplete: ({ context }) => {
        return context.i === sequencer.length();
      },
    },
  }).createMachine({
    context: {
      i: 0,
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
          padDown: {
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
            after: {
              [TIMING_BUFFER_MS]: "_computerTurn",
            },
          },
          _computerTurn: {
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
                  padDown: [
                    {
                      target: "checkComplete",
                      actions: {
                        type: "padDown",
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
        exit: {
          type: "resetSequence",
        },
      },
    },
  });
};
