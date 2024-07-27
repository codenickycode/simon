import { immutableSetOp, useSet } from "./set";
import { renderHook } from "@testing-library/react";

describe("immutableSetOp", () => {
  it("can add an item immutably", () => {
    const original = new Set([1, 2, 3]);
    const result = immutableSetOp({ set: original, item: 4, op: "add" });
    expect([...result]).toEqual([1, 2, 3, 4]);
    expect([...original]).toEqual([1, 2, 3]);
  });
  it("can delete an item immutably", () => {
    const original = new Set([1, 2, 3]);
    const result = immutableSetOp({ set: original, item: 3, op: "delete" });
    expect([...result]).toEqual([1, 2]);
    expect([...original]).toEqual([1, 2, 3]);
  });
});

describe("useSet", () => {
  it("initializes an empty set when no init given", () => {
    const result = renderHook(() => useSet()).result.current;
    expect([...result.items]).toEqual([]);
  });
  it("initializes a provided set when given", () => {
    const result = renderHook(() => useSet(new Set([1, 2, 3]))).result.current;
    expect([...result.items]).toEqual([1, 2, 3]);
  });
  it("adds items", () => {
    const rendered = renderHook(() => useSet(new Set([1, 2, 3])));
    rendered.result.current.add(4);
    rendered.result.current.add(5);
    rendered.rerender();
    expect([...rendered.result.current.items]).toEqual([1, 2, 3, 4, 5]);
  });
  it("deletes items", () => {
    const rendered = renderHook(() => useSet(new Set([1, 2, 3])));
    rendered.result.current.delete(3);
    rendered.result.current.delete(2);
    rendered.rerender();
    expect([...rendered.result.current.items]).toEqual([1]);
  });
  it("ignores already added or deleted", () => {
    const rendered = renderHook(() => useSet(new Set([1, 2, 3])));
    rendered.result.current.add(1);
    rendered.result.current.delete(4);
    rendered.rerender();
    expect([...rendered.result.current.items]).toEqual([1, 2, 3]);
  });
});
