export class SimpleObservable<N> {
  private _observers: ((notifyArg: N) => void)[] = [];
  subscribe = (observer: (notifyArg: N) => void) => {
    this._observers.push(observer);
  };
  notify = (arg: N) => {
    for (const observer of this._observers) {
      observer(arg);
    }
  };
}
