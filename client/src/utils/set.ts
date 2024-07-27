import { useCallback, useState } from "react";

/** Operates on a set immutably, by first creating a copy. */
export const immutableSetOp = <T>({
  set,
  item,
  op,
}: {
  set: Set<T>;
  item: T;
  op: "add" | "delete";
}): Set<T> => {
  const newSet = new Set([...set]);
  newSet[op](item);
  return newSet;
};

/** React state hook for a Set */
export const useSet = <T>(init: Set<T> = new Set()) => {
  const [items, setItems] = useState(init);

  const add = useCallback((item: T) => {
    setItems((prev) => {
      return immutableSetOp({ set: prev, item, op: "add" });
    });
  }, []);

  const del = useCallback((item: T) => {
    setItems((prev) => {
      return immutableSetOp({ set: prev, item, op: "delete" });
    });
  }, []);

  const reset = useCallback(() => {
    setItems(new Set(init));
  }, [init]);

  return { items, add, delete: del, reset };
};
