import { randomIndex } from './array';

describe('randomIndex', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });
  it('is not random in e2e env', () => {
    vi.stubEnv('E2E', 'true');
    const fourItems = [0, 1, 2, 3];
    const shouldBeSequential = [
      randomIndex(fourItems),
      randomIndex(fourItems),
      randomIndex(fourItems),
      randomIndex(fourItems),
      randomIndex(fourItems),
      randomIndex(fourItems),
      randomIndex(fourItems),
      randomIndex(fourItems),
      randomIndex(fourItems),
      randomIndex(fourItems),
      randomIndex(fourItems),
      randomIndex(fourItems),
      randomIndex(fourItems),
      randomIndex(fourItems),
      randomIndex(fourItems),
      randomIndex(fourItems),
    ];
    expect(shouldBeSequential).toEqual([
      0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3,
    ]);
  });
  it('is random when not in e2e env', () => {
    vi.stubEnv('E2E', 'false');
    const fourItems = [0, 1, 2, 3];
    const probNotSequential = [
      randomIndex(fourItems),
      randomIndex(fourItems),
      randomIndex(fourItems),
      randomIndex(fourItems),
      randomIndex(fourItems),
      randomIndex(fourItems),
      randomIndex(fourItems),
      randomIndex(fourItems),
      randomIndex(fourItems),
      randomIndex(fourItems),
      randomIndex(fourItems),
      randomIndex(fourItems),
      randomIndex(fourItems),
      randomIndex(fourItems),
      randomIndex(fourItems),
      randomIndex(fourItems),
    ];
    expect(probNotSequential).not.toEqual([
      0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3,
    ]);
  });
});
