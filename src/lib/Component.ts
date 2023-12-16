import { ElementNode } from './elements/Element'
import { Renderer } from './renderer/renderer'

export abstract class Component<P extends object = object> {
  protected readonly props: P

  constructor(props?: P = {}) {
    this.props = props
  }

  _renderer = new Renderer(this)

  abstract render(): ElementNode
}
