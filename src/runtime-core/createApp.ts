import { render } from "./renderer";
import { createVNode } from "./vnode";

export function createApp(rootComponent) {
  return {
    mount(rootContainer) {
    // 先转换为虚拟节点
    // 再从虚拟节点 vnode 做处理
      const vnode = createVNode(rootComponent);
      // 就是做 patch 功能
      render(vnode, rootContainer);
    },
  };
}
