import { ElementNodeData } from '../elements/Element'

export function initListeners(element: HTMLElement, node: ElementNodeData) {
  for (const key in node.listeners) {
    if (Object.prototype.hasOwnProperty.call(node.listeners, key)) {
      const listener = node.listeners[key]
      element.addEventListener(key, listener.callback, listener.options)
    }
  }
}

export function clearListeners(element: HTMLElement, node: ElementNodeData) {
  for (const key in node.listeners) {
    if (Object.prototype.hasOwnProperty.call(node.listeners, key)) {
      const listener = node.listeners[key]
      element.removeEventListener(key, listener.callback, listener.options)
    }
  }
}
