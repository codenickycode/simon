import { toggleSetItem } from "./set";

describe("toggleSetItem", () => {
  it("can add an item immutably", () => {
    const original = new Set([1, 2, 3]);
    const result = toggleSetItem({ set: original, item: 4, op: "add" });
    expect([...result]).toEqual([1, 2, 3, 4]);
    expect([...original]).toEqual([1, 2, 3]);
  });
  it("can remove an item immutably", () => {
    const original = new Set([1, 2, 3]);
    const result = toggleSetItem({ set: original, item: 3, op: "delete" });
    expect([...result]).toEqual([1, 2]);
    expect([...original]).toEqual([1, 2, 3]);
  });
});
