import { extend } from "../shared";
//   全局effect函数的实例对象
let activeEffect;
let shouldTrack = false;
export class ReactiveEffect {
  private _fn: any;
  deps = [];
  active = true;
  onStop?: () => void;
  public scheduler: Function | undefined;
  constructor(fn, scheduler?: Function) {
    this._fn = fn;
    this.scheduler = scheduler;
  }
  run() {
    if (!this.active) {
      return this._fn();
    }

    // 应该收集
    shouldTrack = true;
    activeEffect = this;
    const r = this._fn();

    // 重置
    shouldTrack = false;

    return r;
  }
  stop() {
    // stop 只执行一次
    if (this.active) {
      // 通过effect去清理deps
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}
function cleanupEffect(effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect);
  });

  // 把 effect.deps 清空
  effect.deps.length = 0;
}

const targetMap = new Map();
export function track(target, key) {
  if (!isTracking()) return;
  // target -> key -> dep
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }
  trackEffects(dep);
}
// 因为ref 只有一个dep,所以提取出来使用
export function trackEffects(dep) {
  // 看看 dep 之前有没有添加过，添加过的话 那么就不添加了
  if (dep.has(activeEffect)) return;
  dep.add(activeEffect);
  activeEffect.deps.push(dep);
}
export function isTracking() {
  return shouldTrack && activeEffect !== undefined;
}

export function trigger(target, key) {
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);
  triggerEffects(dep);
}

export function triggerEffects(dep) {

  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}


export function effect(fn, options: any = {}) {
  // fn 将一个effect进行实例化封装,也就是测试用例中effect函数在实际中的实现
  const _effect = new ReactiveEffect(fn, options.scheduler);
  // _effect.onStop = options.onStop;
  extend(_effect, options);
  _effect.run();
  // 当调用 runner 的时候可以重新执行 effect.run
  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}
export function stop(runner) {
  runner.effect.stop();
}
