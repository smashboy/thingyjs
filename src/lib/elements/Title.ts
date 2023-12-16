import { ElementNode, NodeReactivePropery } from './Element'
import { createNodeFunction } from '../utils'

export class TitleNode<L = 1 | 2 | 3 | 4 | 5 | 6> extends ElementNode<'h1'> {
  constructor(text: NodeReactivePropery<string>, level: L = 1) {
    // @ts-ignore
    super(`h${level}`)

    this.child(text)
  }
}

// @ts-ignore
export const Title = createNodeFunction<typeof TitleNode, TitleNode>(TitleNode)
