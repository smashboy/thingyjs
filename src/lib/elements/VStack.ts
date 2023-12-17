import { createNodeFunction } from '../utils'
import { FlexNode } from './Flex/Flex'

export class VStackNode extends FlexNode {
  constructor() {
    super()

    this.direction('column')
    this.justify('flex-start')
    this.align('flex-start')
  }
}

export const VStack = createNodeFunction<typeof VStackNode, VStackNode>(
  // @ts-ignore
  VStackNode
)
