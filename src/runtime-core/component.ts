import { shallowReadonly } from "../reactivity/reactive";
import { initProps } from "./componentProps";
import { PublicInstanceProxyHandlers } from "./componentPublicInstance";
import { emit } from "./componentEmit";
import { initSlots } from "./componentSlots";
export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    slots: {},
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
    // 第一个点
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit,
    });

    handleSetupResult(instance, setupResult);
  }
}

function handleSetupResult(instance, setupResult: any) {
  // function Object
  // TODO function
  if (typeof setupResult === "object") {
    instance.setupState = setupResult;
  }

  finishComponentSetup(instance);
}

function finishComponentSetup(instance: any) {
  const Component = instance.type;

  // if (!Component.render) {
  instance.render = Component.render;
  // }
}
