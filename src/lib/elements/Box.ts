import { createNodeFunction } from '../utils'
import { ElementNode } from './Element'

export class BoxNode extends ElementNode<'div'> {
  constructor() {
    super('div')
  }
}

// @ts-ignore
export const Box = createNodeFunction<typeof BoxNode, BoxNode>(BoxNode)
