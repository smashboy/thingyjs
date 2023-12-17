import { createNodeFunction } from '../utils'
import { ElementNode } from './Element'

export class InputNode extends ElementNode<'input'> {
  constructor(onChange?: (event: HTMLElementEventMap['input']) => void) {
    super('input')

    if (onChange) {
      this.listen('input', onChange)
    }
  }

  value(value: string) {
    this.element.value = value
    this.element.setAttribute('value', value)
  }
}

export const Input = createNodeFunction<typeof InputNode, InputNode>(
  // @ts-ignore
  InputNode
)
