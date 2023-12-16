import { StateValue } from '../state'
import { createNodeFunction } from '../utils'
import { FlexNode } from './Flex'

export class HStackNode<S extends StateValue = StateValue> extends FlexNode<S> {
  constructor(state?: S) {
    super(state)

    this.direction('row')
    this.justify('flex-start')
    this.align('flex-start')
  }
}

export const HStack = createNodeFunction<typeof HStackNode, HStackNode>(
  // @ts-ignore
  HStackNode
)
