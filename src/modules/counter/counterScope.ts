class CounterScope {
  private __changed = false;
  get changed() {
    return this.__changed;
  }
  set changed(value: boolean) {
    this.__changed = value;
  }

  private __count = 0;
  get count() {
    return this.__count;
  }
  set count(value: number) {
    if (this.__count !== value) {
      this.__count = value;
      this.__changed = true;
    }
  }

  increment() {
    this.count++;
  }

  decrement() {
    this.count--;
  }
}

export default CounterScope;
