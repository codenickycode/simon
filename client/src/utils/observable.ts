export class SimpleObservable<N> {
  private _observers = new Set<(notifyArg: N) => void>();
  /** Subscribes an observer and returns an unsubscribe function */
  subscribe = (observer: (notifyArg: N) => void) => {
    this._observers.add(observer);
    return () => {
      this._observers.delete(observer);
    };
  };
  notify = (arg: N) => {
    for (const observer of this._observers) {
      observer(arg);
    }
  };
}
