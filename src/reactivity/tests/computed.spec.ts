import { computed } from "../computed";
import { reactive } from "../reactive";

describe("computed", () => {
  it("happy path", () => {
    const user = reactive({
      age: 1,
    });

    const age = computed(() => {
      return user.age;
    });

    expect(age.value).toBe(1);
  });

  it("should compute lazily", () => {
    const value = reactive({
      foo: 1,
    });
    const getter = vi.fn(() => {
      return value.foo;
    });
    const cValue = computed(getter);

    // lazy
    expect(getter).not.toHaveBeenCalled();

    expect(cValue.value).toBe(1);
    expect(getter).toHaveBeenCalledTimes(1);

    // should not compute again,使用的是 dirty 锁 get的阶段
    cValue.value; // get
    expect(getter).toHaveBeenCalledTimes(1);

    // should not compute until needed，在 set 阶段 触发 trigger,通过 scheduler 重新打开 computed
    value.foo = 2;
    expect(getter).toHaveBeenCalledTimes(1);

    // now it should compute
    expect(cValue.value).toBe(2);
    expect(getter).toHaveBeenCalledTimes(2);

    // should not compute again，再次调用的时候，还是 dirty 处理完成
    cValue.value;
    expect(getter).toHaveBeenCalledTimes(2);
  });
});
