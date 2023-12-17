import { createNodeFunction } from '../../utils'
import { ElementNode } from '../Element'
import classes from './Title.module.css'

type TitleLevel = 1 | 2 | 3 | 4 | 5 | 6

export class TitleNode<L extends TitleLevel> extends ElementNode<'h1'> {
  constructor(text: string, level: L = 1) {
    // @ts-ignore
    super(`h${level}`)

    this.className(classes.root)

    this.child(text)
  }
}

// @ts-ignore
export const Title = createNodeFunction<typeof TitleNode, TitleNode>(TitleNode)
