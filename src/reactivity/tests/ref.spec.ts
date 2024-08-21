import { effect } from "../effect";
import { isRef, ref, unRef, proxyRefs } from "../ref";
import { reactive } from "../reactive";
describe("ref", () => {
  it("happy path", () => {
    const a = ref(1);
    // 对应get方法获取到实例中的值
    expect(a.value).toBe(1);
  });

  it("should be reactive", () => {
    const a = ref(1);
    let dummy;
    let calls = 0;
    // 自己写的函数
    effect(() => {
      calls++;
      dummy = a.value;
    });
    expect(calls).toBe(1);
    expect(dummy).toBe(1);
    // set 的过程
    a.value = 2;
    expect(calls).toBe(2);
    expect(dummy).toBe(2);
    // same value should not trigger
    a.value = 2;
    expect(calls).toBe(2);
    expect(dummy).toBe(2);
  });

  it("should make nested properties reactive", () => {
    const a = ref({
      count: 1,
    });
    let dummy;
    effect(() => {
      dummy = a.value.count;
    });
    expect(dummy).toBe(1);
    // set 值
    a.value.count = 2;
    expect(dummy).toBe(2);
  });

  it("isRef", () => {
    const a = ref(1);
    const user = reactive({
      age: 1,
    });
    // 通过类中的属性标记值
    expect(isRef(a)).toBe(true);
    expect(isRef(1)).toBe(false);
    expect(isRef(user)).toBe(false);
  });
  // 如果是ref 就获取到值，否则就返回对应参数
  it("unRef", () => {
    const a = ref(1);
    expect(unRef(a)).toBe(1);
    expect(unRef(2)).toBe(2);
  });
  it("proxyRefs", () => {
    const user = {
      age: ref(10),
      name: "xiaohong",
    };

    // get 如果是ref,那么就返回.value的值
    // 如果不是ref,那么就返回get的值
    const proxyUser = proxyRefs(user);
    // 如下两种的区别，不用在写value了。主要用在 template 这样的写法上
    expect(user.age.value).toBe(10);
    expect(proxyUser.age).toBe(10);
    expect(proxyUser.name).toBe("xiaohong");

    // 当给普通值的时候
    proxyUser.age = 20;

    expect(proxyUser.age).toBe(20);
    expect(user.age.value).toBe(20);
    // 当给ref的值
    proxyUser.age = ref(10);
    expect(proxyUser.age).toBe(10);
    expect(user.age.value).toBe(10);
  });
});
