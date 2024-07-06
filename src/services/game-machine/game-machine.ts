import { useCallback, useEffect, useMemo, useState } from "react";
import { setup, fromPromise } from "xstate";
import { useMachine } from "@xstate/react";
import { keyToPadTone, PADS, PadTone } from "../../types/pad";
import { sequencer, TIMING_BUFFER_MS } from "../sequencer";
import { useKeyCycle } from "../../utils/keyboard";

interface GameContext {
  i: number;
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

export const useGameController = () => {
  const stateMachine = useMemo(() => setupStateMachine(), []);
  const [state, send] = useMachine(stateMachine);
  const padController = usePadController({ send });
  return {
    padController,
    gameState: {
      startSequence: useCallback(() => send({ type: "start" }), [send]),
      highScore: state.context.highScore,
      state,
    },
  };
};

const usePadController = ({ send }: { send: (event: GameEvent) => void }) => {
  const [activePad, setActivePad] = useState<PadTone | undefined>();
  const onPadDown = useCallback(
    (note: PadTone) => {
      send({ type: "input", value: note });
    },
    [send]
  );
  const onPadUp = useCallback(() => setActivePad(undefined), []);
  // when the sequencer plays a note, it is a "pad down", so set a timeout and
  // give it a "pad up"
  useEffect(() => {
    sequencer.setOnPlayNote((padTone: PadTone | undefined) => {
      setActivePad(padTone);
      setTimeout(onPadUp, 150);
    });
  }, [onPadUp]);
  useKeyCycle({
    downHandler: (key: string) => {
      const tone = keyToPadTone(key);
      tone && onPadDown(tone);
    },
    upHandler: onPadUp,
  });
  return { activePad, onPadDown, onPadUp };
};

const setupStateMachine = () => {
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
        event.type === "input" && sequencer.playNote(event.value);
      },
      input: ({ context, event }) => {
        event.type === "input" && sequencer.playNote(event.value);
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
      correct: ({ context, event }: GuardType) => {
        if (
          event.type === "input" &&
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
        exit: {
          type: "resetSequence",
        },
      },
    },
  });
};
