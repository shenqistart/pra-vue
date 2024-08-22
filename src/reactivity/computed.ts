import { ReactiveEffect } from "./effect";

class ComputedRefImpl {
  private _dirty: boolean = true;
  private _value: any;
  private _effect: any;
  // getter: any;
  constructor(getter) {
    this._effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true;
      }
    });
    // this.getter = getter;
  }

  get value() {
    if (this._dirty) {
      this._dirty = false;
      this._value = this._effect.run();
    }

    return this._value;
    // return this.getter();
  }
}

export function computed(getter) {
  return new ComputedRefImpl(getter);
}
