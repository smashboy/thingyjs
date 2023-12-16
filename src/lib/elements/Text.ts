import * as CSS from 'csstype'
import { ElementNode } from './Element'
import { createNodeFunction } from '../utils'

export class TextNode extends ElementNode<'div'> {
  private textNode!: Text

  constructor(text: string) {
    super('div')

    this.child(text, (node) => (this.textNode = node as Text))
  }

  setValue(value: string) {
    this.textNode.remove()
    this.child(value, (node) => (this.textNode = node as Text))
  }

  size(size: CSS.Property.FontSize) {
    this.styles({
      fontSize: size
    })

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
