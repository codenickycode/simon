export const singleton = <Value>(
  name: string,
  valueFactory: () => Value
): Value => {
  const g = globalThis as unknown as { __singletons: Record<string, unknown> };
  g.__singletons ??= {};
  g.__singletons[name] ??= valueFactory();
  return g.__singletons[name] as Value;
};
