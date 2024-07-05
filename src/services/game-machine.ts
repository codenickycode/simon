import { setup, raise } from "xstate";
import { PADS, PadTone } from "../types/pad";

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

export const machine = setup({
  types: {
    context: {} as GameContext,
    events: {} as GameEvent,
  },
  actions: {
    // we have to declare this type once and then the rest of the actions are typed 🤷
    addToSequence: ({ context }: { context: GameContext }) => {
      const tones = Object.values(PADS).map((p) => p.tone);
      const index = Math.floor(Math.random() * 4);
      context.sequence.push(tones[index]);
    },
    checkSequence: ({ context }) => {
      if (context.i === context.sequence.length) {
        return raise({ type: "sequenceComplete" });
      }
    },
    checkHighScore: ({ context }) => {
      const userScore = context.i + 1;
      if (userScore > context.highScore) {
        context.highScore = userScore;
      }
    },
    reset: ({ context }) => {
      context.sequence = [];
      context.i = 0;
    },
    incrementI: ({ context }) => {
      context.i++;
    },
  },
  actors: {
    // @ts-expect-error not sure what it expects here
    playSequence: async () => {
      // todo: play sequence
    },
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
              target: "USER_TURN",
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
          states: {
            idle: {
              on: {
                input: [
                  {
                    target: "idle",
                    actions: {
                      type: "incrementI",
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
              entry: {
                type: "checkSequence",
              },
            },
          },
        },
      },
    },
    gameover: {
      after: {
        "5000": {
          target: "idle",
        },
      },
      entry: {
        type: "checkHighScore",
      },
      exit: {
        type: "reset",
      },
    },
  },
});
