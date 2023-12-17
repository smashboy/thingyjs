import { ElementNode } from '../Element'
import { createNodeFunction } from '../../utils'
import { TextNode, Text } from '../Text/Text'
import classes from './Button.module.css'

export class ButtonNode extends ElementNode<'button'> {
  constructor(
    label: TextNode | string,
    onClick?: (event: HTMLElementEventMap['click']) => void
  ) {
    super('button')

    this.child(typeof label === 'string' ? Text(label) : label)

    this.className(classes.root, classes.brand, classes.sm)

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
