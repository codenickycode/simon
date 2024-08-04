export class SimpleObservable<N> {
  private observers: ((notifyArg: N) => void)[] = [];
  subscribe = (observer: (notifyArg: N) => void) => {
    this.observers.push(observer);
  };
  notify = (arg: N) => {
    for (const observer of this.observers) {
      observer(arg);
    }
  };
}
