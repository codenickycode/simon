import { useCallback, useState } from "react";

/** Toggles an item in a set immutably by first making a copy. */
export const toggleSetItem = <T>({
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

/** Toggle items of a set on/off */
export const useToggleItems = <T>(init: Set<T> = new Set()) => {
  const [items, setItems] = useState(init);

  const on = useCallback((item: T) => {
    setItems((prev) => {
      return toggleSetItem({ set: prev, item, op: "add" });
    });
  }, []);

  const off = useCallback((item: T) => {
    setItems((prev) => {
      return toggleSetItem({ set: prev, item, op: "delete" });
    });
  }, []);

  const reset = useCallback(() => {
    setItems(new Set(init));
  }, [init]);

  return { items, on, off, reset };
};
