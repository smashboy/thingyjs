import { StateValue } from '../state'
import { createNodeFunction } from '../utils'
import { ElementNode } from './Element'

export class BoxNode<S extends StateValue = StateValue> extends ElementNode<
  'div',
  S
> {
  constructor(state?: S) {
    super('div', state)
  }
}

// @ts-ignore
export const Box = createNodeFunction<typeof BoxNode, BoxNode>(BoxNode)
