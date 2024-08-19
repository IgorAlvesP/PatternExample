import CounterScope from "./counterScope";

export class CounterPresenter {
  public readonly scope = new CounterScope();
  public forceUpdate: () => void = () => {};

  increment() {
    this.scope.increment();
    this.update();
    this.scope.changed = true;
  }

  decrement() {
    this.scope.decrement();
    this.update();
    this.scope.changed = true;
  }

  private update() {
    if (this.scope.changed) {
      this.scope.changed = false;
      this.forceUpdate();
    }
  }
}
