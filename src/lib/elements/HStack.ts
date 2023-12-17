import { createNodeFunction } from '../utils'
import { FlexNode } from './Flex/Flex'

export class HStackNode extends FlexNode {
  constructor() {
    super()

    this.direction('row')
    this.justify('flex-start')
    this.align('flex-start')
  }
}

export const HStack = createNodeFunction<typeof HStackNode, HStackNode>(
  // @ts-ignore
  HStackNode
)
