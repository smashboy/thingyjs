import { StateValue } from '../state'
import { createNodeFunction } from '../utils'
import { ElementNode } from './Element'

export class InputNode<S extends StateValue = StateValue> extends ElementNode<
  'input',
  S
> {
  constructor(
    onChange?: (event: HTMLElementEventMap['input']) => void,
    state?: S
  ) {
    super('input', state)

    if (onChange) {
      this.listen('input', onChange)
    }
  }
}

export const Input = createNodeFunction<typeof InputNode, InputNode>(
  // @ts-ignore
  InputNode
)
