/** Operates on a set immutably, by first creating a copy. */
export const immutableSetOp = <T>({
  set,
  item,
  op,
}: {
  set: Set<T>;
  item: T;
  op: 'add' | 'delete';
}): Set<T> => {
  const newSet = new Set([...set]);
  newSet[op](item);
  return newSet;
};
