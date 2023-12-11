export type StateValue = Record<string | symbol, any>;

export const IS_STATE_KEY = Symbol("_isState");
export const STATE_BIND_KEY = Symbol("_bindState");

export function state<T extends StateValue>(value: T) {
  const nodes = new Map<string, () => void>();

  Object.defineProperty(value, IS_STATE_KEY, {
    configurable: false,
    writable: false,
    enumerable: false,
    value: true,
  });

  Object.defineProperty(value, STATE_BIND_KEY, {
    configurable: false,
    writable: false,
    enumerable: false,
    value: (nodeId: string, onUpdate: () => void) =>
      nodes.set(nodeId, onUpdate),
  });

  return new Proxy(value, {
    get(target, p) {
      return target[p];
    },
    set(target, p, newValue) {
      // @ts-ignore
      target[p] = newValue;

      for (const onUpdate of nodes.values()) {
        onUpdate();
      }

      return true;
    },
  });
}
