import * as CSS from 'csstype'
import { StateValue } from '../state'
import { ElementNode, NodeReactivePropery } from './Element'
import { createNodeFunction } from '../utils'

export class FlexNode<S extends StateValue = StateValue> extends ElementNode<
  'div',
  S
> {
  constructor(state?: S) {
    super('div', state)

    this.styles({
      display: 'flex'
    })
  }

  justify(prop: NodeReactivePropery<CSS.Property.JustifyContent>) {
    if (typeof prop === 'function') {
      this.styles(() => ({
        justifyContent: prop()
      }))
    } else {
      this.styles({
        justifyContent: prop
      })
    }

    return this
  }

  align(prop: NodeReactivePropery<CSS.Property.AlignItems>) {
    if (typeof prop === 'function') {
      this.styles(() => ({
        alignItems: prop()
      }))
    } else {
      this.styles({
        alignItems: prop
      })
    }

    return this
  }

  direction(prop: NodeReactivePropery<CSS.Property.FlexDirection>) {
    if (typeof prop === 'function') {
      this.styles(() => ({
        flexDirection: prop()
      }))
    } else {
      this.styles({
        flexDirection: prop
      })
    }

    return this
  }

  wrap(prop: NodeReactivePropery<CSS.Property.FlexWrap>) {
    if (typeof prop === 'function') {
      this.styles(() => ({
        flexWrap: prop()
      }))
    } else {
      this.styles({
        flexWrap: prop
      })
    }

    return this
  }

  gap(prop: NodeReactivePropery<CSS.Property.Gap>) {
    if (typeof prop === 'function') {
      this.styles(() => ({
        gap: prop()
      }))
    } else {
      this.styles({
        gap: prop
      })
    }

    return this
  }
}

// @ts-ignore
export const Flex = createNodeFunction<typeof FlexNode, FlexNode>(FlexNode)
