import { reactive } from "../reactive";
import { effect } from "../effect";
describe("effect", () => {
  it("happy path", () => {
    const user = reactive({
      age: 10,
    });
    let nextAge;
    // 外部影响
    effect(() => {
      nextAge = user.age + 1;
    });
    expect(nextAge).toBe(11);
    // updata，set
    user.age++;
    expect(nextAge).toBe(12);
    expect(user.age).toBe(11);
  });
  it("should return runner when call effect", () => {
    // 当调用 runner 的时候可以重新执行 effect.run
    // runner 的返回值就是用户给的 fn 的返回值
    let foo = 0;
    const runner = effect(() => {
      foo++;
      return foo;
    });

    expect(foo).toBe(1);
    runner();
    expect(foo).toBe(2);
    expect(runner()).toBe(3);
  });
  // 第二个参数
  // effect第一次执行的时候，会调用 fn
  // set 不会执行fn而是执行scheduler
  // 当执runner的时候，会执行fn
});
