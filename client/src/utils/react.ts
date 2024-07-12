import { SetStateAction } from "react";
import { flushSync } from "react-dom";

/**
 * ⚠️ WARNING: This is a hack and not recommended!
 * 💥 Can lead to performance issues and race conditions.
 * 🤔 You should probably use `useReducer`!
 * Executes a set state call and returns the next value.
 */
export const hackyNextStateSync = <T>(
  setStateCb: React.Dispatch<SetStateAction<T>>,
  nextCalc: (prev: T) => T
): T => {
  let next: T;
  flushSync(() => {
    setStateCb((prev: T) => {
      next = nextCalc(prev);
      return next;
    });
  });
  // @ts-expect-error this is a hack, flushSync means this will be defined
  return next;
};
