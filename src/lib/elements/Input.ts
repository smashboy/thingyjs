import { createNodeFunction } from '../utils'
import { ElementNode } from './Element'

export class InputNode extends ElementNode {
  constructor(onChange?: (event: HTMLElementEventMap['input']) => void) {
    super('input')

    if (onChange) {
      this.listen('input', onChange)
    }
  }
}

export const Input = createNodeFunction<typeof InputNode, InputNode>(
  // @ts-ignore
  InputNode
)
