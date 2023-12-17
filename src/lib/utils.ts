import { Component } from './Component'
import { ElementNode } from './elements/Element'

export function isProxy(obj: any) {
  try {
    // @ts-ignore
    postMessage(obj, window)
  } catch (error) {
    // @ts-ignore
    return error?.code === 25
  }

  return false
}

export function resetObject<T extends object>(obj: T) {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      delete obj[key]
    }
  }
}

export function getSetDiff<T>(a: Set<T>, b: Set<T>) {
  const diff = new Set<T>()

  for (const value of a.values()) {
    if (!b.has(value)) {
      diff.add(value)
    }
  }

  return diff
}

export function transfer<T>(a: T[], b: T[]) {
  for (let index = 0; index < a.length; index++) {
    b[index] = a[index]
  }

  a.splice(0, a.length)
}

// export function unwrap<T>(value: NodeReactivePropery<T>) {
//   return typeof value === 'function' ? (value as () => T)() : value
// }

export function createNodeFunction<
  C extends abstract new (...args: any) => any,
  I extends ElementNode
>(Node: ConstructorParameters<C>) {
  // @ts-ignore
  return (...args: ConstructorParameters<C>) => new Node(...args) as I
}

export function getHTMLElementRef(target: Component | ElementNode | ChildNode) {
  if (target instanceof Component) {
    return target.Body._getElement()
  }

  if (target instanceof ElementNode) {
    return target._getElement()
  }

  return target
}
