import { pads } from "../components/Gamepad/schema";
import { ActivePads, PadKey, PadTone } from "../components/Gamepad/types";
import {
  isPadActive,
  padKeyToPadId,
  padKeyToPadTone,
  padToneToPadId,
  padToneToPadKey,
} from "./pads";

describe("padKeyToPadId", () => {
  test.each(Object.entries(pads))(
    "finds the pad id for the %s pad via key",
    (padId, pad) => {
      const result = padKeyToPadId(pad.key);
      expect(result).toEqual(padId);
    }
  );
  test("returns undefined if it does not find the id", () => {
    const result = padKeyToPadId("foo");
    expect(result).toBeUndefined();
  });
});

describe("padKeyToPadTone", () => {
  test.each(Object.entries(pads))(
    "finds the pad tone for the %s pad via key",
    (_, pad) => {
      const result = padKeyToPadTone(pad.key);
      expect(result).toEqual(pad.tone);
    }
  );
  test("returns undefined if it does not find the key", () => {
    const result = padKeyToPadTone("foo" as PadKey);
    expect(result).toBeUndefined();
  });
});

describe("padToneToPadId", () => {
  test.each(Object.entries(pads))(
    "finds the pad id for the %s pad via tone",
    (padId, pad) => {
      const result = padToneToPadId(pad.tone);
      expect(result).toEqual(padId);
    }
  );
  test("returns undefined if it does not find the id", () => {
    const result = padToneToPadId("foo" as PadTone);
    expect(result).toBeUndefined();
  });
});

describe("padToneToPadKey", () => {
  test.each(Object.entries(pads))(
    "finds the pad key for the %s pad via tone",
    (_, pad) => {
      const result = padToneToPadKey(pad.tone);
      expect(result).toEqual(pad.key);
    }
  );
  test("returns undefined if it does not find the tone", () => {
    const result = padToneToPadKey("foo" as PadTone);
    expect(result).toBeUndefined();
  });
});

describe("isPadActive", () => {
  const activePads: ActivePads = {
    green: false,
    blue: false,
    yellow: false,
    red: false,
  };
  it("returns true if the current pad is active", () => {
    const result = isPadActive("green", { ...activePads, green: true });
    expect(result).toBe(true);
  });
  it("returns false if the current pad is active", () => {
    const result = isPadActive("green", { ...activePads, green: false });
    expect(result).toBe(false);
  });
});
