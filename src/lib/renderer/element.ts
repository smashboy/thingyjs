import {
  ChildLoop,
  ElementNode,
  ElementNodeData,
  ReactiveChild
} from '../elements/Element'
import { unwrap } from '../utils'
import { appendAttributes, clearAttributes } from './attributes'
import { clearListeners, initListeners } from './listeners'
import { appendStyles } from './styles'

interface CreateHTMLOptions {
  resetListeners?: boolean
  resetAttributes?: boolean
  withoutListeners?: boolean
  withoutChildren?: boolean
  withoutAttributes?: boolean
  withoutStyles?: boolean
}

export function createHTMLElement(
  node: ElementNodeData,
  options?: CreateHTMLOptions
) {
  const element = document.createElement(node.tag)

  appendNodeData(element, node, options)

  return () => element
}

export function appendNodeData(
  element: HTMLElement,
  node: ElementNodeData,
  options?: CreateHTMLOptions
) {
  const {
    resetListeners = false,
    withoutListeners = false,
    withoutChildren = false,
    resetAttributes = false,
    withoutAttributes = false,
    withoutStyles
  } = options || {}

  if (resetAttributes) {
    clearAttributes(element)
  }

  if (!withoutAttributes) {
    appendAttributes(element, node)
  }

  if (!withoutStyles) {
    appendStyles(element, node)
  }

  if (resetListeners) {
    clearListeners(element, node)
  }

  if (!withoutListeners) {
    initListeners(element, node)
  }

  if (!withoutChildren) {
    appendChildren(element, node)
  }
}

export function appendChildren(element: HTMLElement, node: ElementNodeData) {
  for (const child of node.children) {
    appendChild(element, child)
  }
}

export function appendChild(element: HTMLElement, child: ReactiveChild) {
  if (child === null || child === undefined) return

  child = unwrap(child)

  // @ts-ignore
  if (ElementNode.isChildLoop(child)) {
    let { array, callback } = child as ChildLoop<any>

    array = unwrap(array)

    for (let index = 0; index < array.length; index++) {
      const item = array[index]

      appendChild(element, callback(item, index, array))
    }

    return
  }

  if (ElementNode.is(child)) {
    element.appendChild(child._getRenderer()._initRender())
    return
  }

  element.appendChild(document.createTextNode(`${child}`))
}

export function isHTMLElementEqualToElementNode(
  element: HTMLElement,
  node: ElementNodeData
) {
  const isEqual = true

  // if (node.style.length === 0 && element.attributeStyleMap('style')) return false

  for (let s of node.style) {
    s = unwrap(s)

    for (const key in s) {
      if (Object.prototype.hasOwnProperty.call(s, key)) {
        const nodeProp = s[key]
        const elProp = element.style[key]
        if (nodeProp !== elProp) {
          return false
        }
      }
    }
  }

  if (
    Object.keys(node.attributes).length + (node.style.length > 0 ? 1 : 0) !==
    element.attributes.length
  )
    return false

  for (const key in node.attributes) {
    if (Object.prototype.hasOwnProperty.call(node.attributes, key)) {
      const nodeAttr = node.attributes[key]
      const elAttr = element.attributes.getNamedItem(key)
      if (!elAttr) return false
      if (nodeAttr !== elAttr.value) return false
    }
  }

  return isEqual
}
