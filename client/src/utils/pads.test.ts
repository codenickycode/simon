import { pads } from "../components/Gamepad/schema";
import { PadKey, PadTone } from "../components/Gamepad/types";
import { padKeyToPadTone, padToneToPadKey } from "./pads";

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
