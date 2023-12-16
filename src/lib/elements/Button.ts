import { createNodeFunction } from '../utils'
import { ElementNode } from './Element'
import { Text, TextNode } from './Text'

export class ButtonNode extends ElementNode<'button'> {
  constructor(
    label: TextNode | string,
    onClick?: (event: HTMLElementEventMap['click']) => void
  ) {
    super('button')

    this.child(typeof label === 'string' ? Text(label) : label)

    if (onClick) {
      this.listen('click', onClick)
    }
  }

  submit() {
    this.attribute('type', 'submit')

    return this
  }
}

export const Button = createNodeFunction<typeof ButtonNode, ButtonNode>(
  // @ts-ignore
  ButtonNode
)
