import { h } from "../../lib/guide-mini-vue.esm.js";


// 1. setup 中可以传 props
export const Foo = {
  setup(props) {
    // props.count
    console.log(props);

    // 3.
    // shallow readonly 
    props.count++
    console.log(props);

  },
  render() {
    // 2. 可以进行 count 的绑定
    return h("div", {}, "foo: " + this.count);
  },
};
