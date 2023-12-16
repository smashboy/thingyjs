import { Child, ElementNode } from '../elements/Element'
import { unwrap } from '../utils'
import { appendChild, appendNodeData, createHTMLElement } from './element'

export function patchTree(
  prev: Element | ChildNode,
  node: ElementNode | Child
) {
  const u = unwrap(node)

  if (!ElementNode.is(u)) {
    if (!u) {
      prev.remove()
    } else {
      const newTextContent = `${node}`

      if (prev.textContent !== newTextContent) {
        prev.textContent = newTextContent
      }
    }
  }

  if (ElementNode.is(u)) {
    const data = u._getNode()

    const newCloneWithoutChildren = createHTMLElement(data, {
      withoutChildren: true,
      withoutListeners: true
    })

    if (!prev.cloneNode(false).isEqualNode(newCloneWithoutChildren)) {
      if (prev.nodeName === newCloneWithoutChildren.nodeName) {
        appendNodeData(prev as HTMLElement, data, {
          resetListeners: true,
          resetStyles: true,
          resetAttributes: true,
          withoutChildren: true
        })
      } else {
        appendNodeData(newCloneWithoutChildren, data, {
          withoutStyles: true,
          withoutAttributes: true
        })
        prev.replaceWith(newCloneWithoutChildren)

        return newCloneWithoutChildren
      }
    }

    for (let i = 0; i < data.children.length; i++) {
      const child = unwrap(data.children[i])

      const prevHTMLChild = prev.childNodes[i]

      if (prevHTMLChild) {
        patchTree(prevHTMLChild, child)
        continue
      }

      appendChild(prev, child)
    }

    if (prev.childNodes.length > data.children.length) {
      const start = prev.childNodes.length
      for (let index = start; index > data.children.length - 1; index--) {
        prev.childNodes[index]?.remove()
      }
    }
  }

  return prev
}
