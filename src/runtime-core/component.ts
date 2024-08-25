import { proxyRefs } from "..";
import { shallowReadonly } from "../reactivity/reactive";
import { initProps } from "./componentProps";
import { PublicInstanceProxyHandlers } from "./componentPublicInstance";
import { emit } from "./componentEmit";
import { initSlots } from "./componentSlots";
export function createComponentInstance(vnode,parent) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    slots: {},
    provides: parent ? parent.provides : {},
    parent,
    isMounted: false,
    subTree: {},
    emit: () => {},
  };
  // 使用优化技巧 emit('add') 直接写事件，第一个参数完成，用户只能修改之后的参数
  component.emit = emit.bind(null, component) as any;
  return component;
}

export function setupComponent(instance) {
  // 将虚拟节点的 props 转到实例上面
  initProps(instance, instance.vnode.props);
  initSlots(instance, instance.vnode.children);
  // 处理有状态的组件
  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance: any) {
  const Component = instance.type;

  // 注意 proxy 的使用方法
  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);

  const { setup } = Component;

  if (setup) {
    // 第一层和第二层
    setCurrentInstance(instance);
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit,
    });
    setCurrentInstance(null);
    handleSetupResult(instance, setupResult);
  }
}

function handleSetupResult(instance, setupResult: any) {
  // function Object
  // TODO function
  if (typeof setupResult === "object") {
    instance.setupState = proxyRefs(setupResult);
  }

  finishComponentSetup(instance);
}

function finishComponentSetup(instance: any) {
  const Component = instance.type;

  // if (!Component.render) {
  instance.render = Component.render;
  // }
}

let currentInstance = null;

export function getCurrentInstance() {
  return currentInstance;
}

export function setCurrentInstance(instance) {
  currentInstance = instance;
}
