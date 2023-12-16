import { Component } from './Component'
import { ElementNode } from './elements/Element'

export type StateValue = Record<string | symbol, any>

export const IS_STATE_KEY = Symbol('_isState')
export const STATE_BIND_KEY = Symbol('_bindState')
export const STATE_GET_RAW_VALUE = Symbol('_getStateRawValue')

export function state<T extends StateValue>(value: T, component: Component) {
  const nodes = new Map<number, () => void>()

  Object.defineProperty(value, IS_STATE_KEY, {
    configurable: false,
    writable: false,
    enumerable: false,
    value: true
  })

  Object.defineProperty(value, STATE_BIND_KEY, {
    configurable: false,
    writable: false,
    enumerable: false,
    value: (nodeId: number, onUpdate: () => void) => nodes.set(nodeId, onUpdate)
  })

  Object.defineProperty(value, STATE_GET_RAW_VALUE, {
    configurable: false,
    writable: false,
    enumerable: false,
    value: () => value
  })

  return new Proxy(value, {
    get(target, p) {
      return target[p]
    },
    set(target, p, newValue) {
      // @ts-ignore
      target[p] = newValue

      component._renderer.rerender()

      return true
    }
  })
}
