import { ElementNodeData } from '../elements/Element'

export function appendAttributes(element: HTMLElement, node: ElementNodeData) {
  for (const key in node.attributes) {
    if (Object.prototype.hasOwnProperty.call(node.attributes, key)) {
      const value = node.attributes[key]
      element.setAttribute(key, value!)
    }
  }
}

export function clearAttributes(element: HTMLElement) {
  for (const attr of element.attributes) {
    element.removeAttribute(attr.name)
  }
}
