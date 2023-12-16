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
