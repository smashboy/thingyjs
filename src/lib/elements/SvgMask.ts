import * as CSS from 'csstype'
import { createNodeFunction } from '../utils'
import { ElementNode } from './Element'

export class SvgMaskNode extends ElementNode<'div'> {
  constructor(
    src: string,
    width: CSS.Property.Width,
    height: CSS.Property.Height,
    backgroundColor?: CSS.Property.BackgroundColor
  ) {
    super('div')

    this.styles({
      mask: `url(${src}) no-repeat center`,
      width,
      height,
      display: 'block',
      backgroundColor
    })
  }
}

export const SvgMask = createNodeFunction<typeof SvgMaskNode, SvgMaskNode>(
  // @ts-ignore
  SvgMaskNode
)
