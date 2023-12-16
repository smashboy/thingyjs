import { ElementNode } from './Element'
import { createNodeFunction } from '../utils'

type TitleLevel = 1 | 2 | 3 | 4 | 5 | 6

export class TitleNode<L extends TitleLevel> extends ElementNode<'h1'> {
  constructor(text: string, level: L = 1) {
    // @ts-ignore
    super(`h${level}`, state)

    this.child(text)
  }
}

// @ts-ignore
export const Title = createNodeFunction<typeof TitleNode, TitleNode>(TitleNode)
