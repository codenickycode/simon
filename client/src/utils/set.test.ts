import { immutableSetOp } from './set';

describe('immutableSetOp', () => {
  it('can add an item immutably', () => {
    const original = new Set([1, 2, 3]);
    const result = immutableSetOp({ set: original, item: 4, op: 'add' });
    expect([...result]).toEqual([1, 2, 3, 4]);
    expect([...original]).toEqual([1, 2, 3]);
  });
  it('can delete an item immutably', () => {
    const original = new Set([1, 2, 3]);
    const result = immutableSetOp({ set: original, item: 3, op: 'delete' });
    expect([...result]).toEqual([1, 2]);
    expect([...original]).toEqual([1, 2, 3]);
  });
});
