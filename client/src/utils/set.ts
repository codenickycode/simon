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
