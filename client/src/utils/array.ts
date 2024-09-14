function* cyclicNums(): Generator<number, never, unknown> {
  while (true) {
    yield 0;
    yield 1;
    yield 2;
    yield 3;
  }
}
const nextNumber = cyclicNums();

/** Given an array of items, returns a random index based on length. If env is E2E, cycles 0-3 */
export const randomIndex = (arr: unknown[]) => {
  if (import.meta.env.E2E === 'true') {
    return nextNumber.next().value;
  }
  return Math.floor(Math.random() * arr.length);
};
