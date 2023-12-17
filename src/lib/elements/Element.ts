import * as CSS from 'csstype'
import { createNodeFunction, getHTMLElementRef } from '../utils'
import { Component } from '../Component'
import clsx, { ClassValue } from 'clsx'

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

  className(...values: ClassValue[]) {
    this.element.className = clsx(this.element.className, ...values)

    return this
  }

  child(child: Child | Component, onSet?: (node: Text | Element) => void) {
    if (ElementNode.is(child)) {
      const el = child._getElement()
      this.element.appendChild(el)
      onSet?.(el)
    } else if (child instanceof Component) {
      const el = child.Body._getElement()
      this.element.appendChild(el)
    } else {
      const textNode = document.createTextNode(`${child}`)
      onSet?.(textNode)
      this.element.appendChild(textNode)
    }

    return this
  }

  removeChild(value: ChildNode | ElementNode | Component) {
    for (let index = 0; index < this.element.childNodes.length; index++) {
      const child = this.element.childNodes[index]
      if (child.isSameNode(getHTMLElementRef(value))) {
        child.remove()
        break
      }
    }

    return this
  }

  replace(
    p: ChildNode | ElementNode | Component,
    n: ChildNode | ElementNode | Component
  ) {
    p = getHTMLElementRef(p)
    n = getHTMLElementRef(n)

    for (const child of this.element.childNodes) {
      if (child.isSameNode(p)) {
        child.replaceWith(n)
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
