import { createNodeFunction } from '../utils'
import { ElementNode } from './Element'

export class ImageNode extends ElementNode<'img'> {
  constructor(src: string, alt: string) {
    super('img')

    this.element.src = src
    this.element.alt = alt
  }
}

export const Image = createNodeFunction<typeof ImageNode, ImageNode>(
  // @ts-ignore
  ImageNode
)
