import type { NoOp } from "./no-op";

/** Promise that resolves after provided timeout. If cb provided, awaits its
 * resolution before resolving. */
export const delay = async (timeout: number, cb?: NoOp) =>
  await new Promise((res) =>
    setTimeout(async () => {
      await cb?.();
      res(undefined);
    }, timeout)
  );
