import { camelize, toHandlerKey } from "../shared/index";

export function emit(instance, event, ...args) {
  const { props } = instance;
  const handlerName = toHandlerKey(camelize(event));
  const handler = props[handlerName];
  handler && handler(...args);
//TPP 先写一个特定的行为->重构成通用的行为
// const handler = props["onAdd"];
// handler && handler();
}
