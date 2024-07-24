import { toggleSetItem, useToggleItems } from "./set";
import { renderHook } from "@testing-library/react";

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

describe("useToggleItems", () => {
  it("initializes an empty set when no init given", () => {
    const result = renderHook(() => useToggleItems()).result.current;
    expect([...result.items]).toEqual([]);
  });
  it("initializes a provided set when given", () => {
    const result = renderHook(() => useToggleItems(new Set([1, 2, 3]))).result
      .current;
    expect([...result.items]).toEqual([1, 2, 3]);
  });
  it("toggles items on", () => {
    const rendered = renderHook(() => useToggleItems(new Set([1, 2, 3])));
    rendered.result.current.on(4);
    rendered.result.current.on(5);
    rendered.rerender();
    expect([...rendered.result.current.items]).toEqual([1, 2, 3, 4, 5]);
  });
  it("toggles items off", () => {
    const rendered = renderHook(() => useToggleItems(new Set([1, 2, 3])));
    rendered.result.current.off(3);
    rendered.result.current.off(2);
    rendered.rerender();
    expect([...rendered.result.current.items]).toEqual([1]);
  });
  it("ignores already on/off", () => {
    const rendered = renderHook(() => useToggleItems(new Set([1, 2, 3])));
    rendered.result.current.on(1);
    rendered.result.current.off(4);
    rendered.rerender();
    expect([...rendered.result.current.items]).toEqual([1, 2, 3]);
  });
});
