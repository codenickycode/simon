import { pads } from '../components/pad-controller/schema';
import type { PadKey, PadTone } from '../components/pad-controller';
import {
  keyToPadId,
  padKeyToPadTone,
  noteToPadId,
  padToneToPadKey,
} from './pads';

describe('keyToPadId', () => {
  test.each(Object.entries(pads))(
    'finds the pad id for the %s pad via key',
    (padId, pad) => {
      const result = keyToPadId(pad.key);
      expect(result).toEqual(padId);
    },
  );
  test('returns undefined if it does not find the id', () => {
    const result = keyToPadId('foo');
    expect(result).toBeUndefined();
  });
});

describe('padKeyToPadTone', () => {
  test.each(Object.entries(pads))(
    'finds the pad tone for the %s pad via key',
    (_, pad) => {
      const result = padKeyToPadTone(pad.key);
      expect(result).toEqual(pad.tone);
    },
  );
  test('returns undefined if it does not find the key', () => {
    const result = padKeyToPadTone('foo' as PadKey);
    expect(result).toBeUndefined();
  });
});

describe('noteToPadId', () => {
  test.each(Object.entries(pads))(
    'finds the pad id for the %s pad via tone',
    (padId, pad) => {
      const result = noteToPadId(pad.tone);
      expect(result).toEqual(padId);
    },
  );
  test('returns undefined if it does not find the id', () => {
    const result = noteToPadId('foo' as PadTone);
    expect(result).toBeUndefined();
  });
});

describe('padToneToPadKey', () => {
  test.each(Object.entries(pads))(
    'finds the pad key for the %s pad via tone',
    (_, pad) => {
      const result = padToneToPadKey(pad.tone);
      expect(result).toEqual(pad.key);
    },
  );
  test('returns undefined if it does not find the tone', () => {
    const result = padToneToPadKey('foo' as PadTone);
    expect(result).toBeUndefined();
  });
});
