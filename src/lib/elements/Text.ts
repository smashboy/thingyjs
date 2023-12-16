import * as CSS from 'csstype'
import { ElementNode, NodeReactivePropery } from './Element'
import { createNodeFunction } from '../utils'

export class TextNode extends ElementNode<'div'> {
  constructor(text: NodeReactivePropery<string>) {
    super('div')

    this.child(text)
  }

  size(size: NodeReactivePropery<CSS.Property.FontSize>) {
    if (typeof size === 'function') {
      this.styles(() => ({
        fontSize: size()
      }))
    } else {
      this.styles({
        fontSize: size
      })
    }

    return this
  }

  weight(weight: CSS.Property.FontWeight) {
    this.styles({ fontWeight: weight })

    return this
  }

  italic() {
    return this
  }

  truncate() {
    return this
  }
}

// @ts-ignore
export const Text = createNodeFunction<typeof TextNode, TextNode>(TextNode)
