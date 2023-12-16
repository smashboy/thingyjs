import * as CSS from 'csstype'
import { createNodeFunction } from '../utils'

export type Child = ElementNode | string | number | boolean

export type Children = Child[]

export type ElementListener<K extends keyof HTMLElementEventMap> = {
  callback: (event: HTMLElementEventMap[K]) => void
  options?: boolean | AddEventListenerOptions
}

export class ElementNode<
  N extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap
> {
  protected readonly element: HTMLElementTagNameMap[N]

  constructor(tag: N) {
    this.element = document.createElement(tag)
  }

  listen<
    K extends keyof HTMLElementEventMap,
    EL extends ElementListener<K> = ElementListener<K>
  >(event: K, callback: EL['callback'], options?: EL['options']) {
    this.element.addEventListener(event, callback, options)

    return this
  }

  attribute(key: string, value: string) {
    this.element.setAttribute(key, value)
    return this
  }

  styles(styles: Partial<CSS.Properties>) {
    for (const key in styles) {
      if (Object.prototype.hasOwnProperty.call(styles, key)) {
        const property = styles[key]
        this.element.style[key] = property!
      }
    }

    return this
  }

  child(child: Child, onSet?: (node: Text | Element) => void) {
    if (ElementNode.is(child)) {
      const el = child._getElement()
      this.element.appendChild(child._getElement())
      onSet?.(el)
    } else {
      const textNode = document.createTextNode(`${child}`)
      onSet?.(textNode)
      this.element.appendChild(textNode)
    }

    return this
  }

  removeChild(value: number | ChildNode) {
    for (let index = 0; index < this.element.childNodes.length; index++) {
      const child = this.element.childNodes[index]
      if (typeof value === 'number' && value === index) {
        child.remove()
        break
      }

      if (typeof value !== 'number' && child.isSameNode(value)) {
        child.remove()
        break
      }
    }

    return this
  }

  replace(p: ChildNode, n: ChildNode) {
    for (const child of this.element.childNodes) {
      if (child.isSameNode(p)) {
        p.replaceWith(n)
        break
      }
    }
  }

  destroy() {
    this.element.remove()
  }

  _getElement() {
    return this.element
  }

  static is(value: unknown): value is ElementNode {
    return value instanceof ElementNode
  }
}

export const Element = createNodeFunction<typeof ElementNode, ElementNode>(
  // @ts-ignore
  ElementNode
)
