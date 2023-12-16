import { Child, ElementNode } from '../elements/Element'
import { unwrap } from '../utils'
import { appendChild, appendNodeData, createHTMLElement } from './element'

export function patchTree(
  prev: Element | ChildNode,
  node: ElementNode | Child
) {
  const u = unwrap(node)

  if (!ElementNode.is(u)) {
    if (!node) {
      prev.remove()
    } else {
      const newTextContent = `${node}`

      if (prev.textContent !== newTextContent) {
        prev.textContent = newTextContent
      }
    }
  }

  if (ElementNode.is(u)) {
    const prevCloneWithoutChildren = prev.cloneNode(false)
    const data = u._getNode()

    const newCloneWithoutChildren = createHTMLElement(data, {
      withoutChildren: true,
      withoutListeners: true
    })()

    if (!prevCloneWithoutChildren.isEqualNode(newCloneWithoutChildren)) {
      if (prev.nodeName === newCloneWithoutChildren.nodeName) {
        appendNodeData(prev as HTMLElement, data, {
          resetListeners: true,
          resetAttributes: true,
          withoutChildren: true
        })
      } else {
        appendNodeData(newCloneWithoutChildren, data, {
          withoutStyles: true,
          withoutAttributes: true
        })
        prev.replaceWith(newCloneWithoutChildren)

        return () => newCloneWithoutChildren
      }
    }

    let newChildCount = 0

    for (let i = 0; i < data.children.length; i++) {
      const child = unwrap(data.children[i])

      if (ElementNode.isChildLoop(child)) {
        let { array, callback } = child

        array = unwrap(array)

        for (let j = 0; j < array.length; j++) {
          newChildCount++
          const child = callback(array[j], j, array)
          const prevHTMLChild = prev.childNodes[i + j]

          if (prevHTMLChild) {
            patchTree(prevHTMLChild, child)
            continue
          }

          appendChild(prev, child)
        }

        continue
      }

      newChildCount++

      const prevHTMLChild = prev.childNodes[newChildCount - 1]

      if (prevHTMLChild) {
        patchTree(prevHTMLChild, child)
        continue
      }

      appendChild(prev, child)
    }

    if (prev.childNodes.length > newChildCount) {
      const start = prev.childNodes.length
      for (let index = start; index > newChildCount - 1; index--) {
        prev.childNodes[index]?.remove()
      }
    }
  }

  return () => prev
}