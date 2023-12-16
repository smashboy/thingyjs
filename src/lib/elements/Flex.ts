import * as CSS from 'csstype'
import { ElementNode } from './Element'
import { createNodeFunction } from '../utils'

export class FlexNode extends ElementNode<'div'> {
  constructor() {
    super('div')

    this.styles({
      display: 'flex'
    })
  }

  justify(prop: CSS.Property.JustifyContent) {
    this.styles({
      justifyContent: prop
    })

    return this
  }

  align(prop: CSS.Property.AlignItems) {
    this.styles({
      alignItems: prop
    })

    return this
  }

  direction(prop: CSS.Property.FlexDirection) {
    this.styles({
      flexDirection: prop
    })

    return this
  }

  wrap(prop: CSS.Property.FlexWrap) {
    this.styles({
      flexWrap: prop
    })

    return this
  }

  gap(prop: CSS.Property.Gap) {
    this.styles({
      gap: prop
    })

    return this
  }
}

// @ts-ignore
export const Flex = createNodeFunction<typeof FlexNode, FlexNode>(FlexNode)
