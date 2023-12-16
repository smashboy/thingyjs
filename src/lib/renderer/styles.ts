import { ElementNodeData } from '../elements/Element'
import { unwrap } from '../utils'

export function appendStyles(element: HTMLElement, node: ElementNodeData) {
  for (let s of node.style) {
    s = unwrap(s)

    for (const key in s) {
      if (Object.prototype.hasOwnProperty.call(s, key)) {
        const property = s[key]
        element.style[key] = property!
      }
    }
  }
}
