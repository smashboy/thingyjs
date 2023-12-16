import { ElementNode } from '../elements/Element'
import { createHTMLElement } from './element'
import { patchTree } from './patcher'
import { STATE_BIND_KEY, StateValue } from '../state'

export class Renderer {
  private element!: () => HTMLElement
  private nodeRef: ElementNode
  private readonly stateRef: StateValue | void = void 0

  constructor(node: ElementNode, state?: StateValue) {
    this.nodeRef = node
    this.stateRef = state

    this.onStateUpdate = this.onStateUpdate.bind(this)

    this.bindState()
  }

  private bindState() {
    if (this.stateRef) {
      this.stateRef[STATE_BIND_KEY](
        this.nodeRef._getNode().nodeId,
        this.onStateUpdate
      )
    }
  }

  private onStateUpdate() {
    this.updateHTMLElement()
  }

  private updateHTMLElement() {
    this.element = patchTree(this.element(), this.nodeRef)
  }

  _getElement() {
    return this.element()
  }

  _initRender() {
    this.element = createHTMLElement(this.nodeRef._getNode())
    return this.element()
  }
}

export default function render(root: HTMLElement, app: ElementNode) {
  if (!root) {
    throw new Error('Please provide a valid entry for your application')
  }

  root.appendChild(app._getRenderer()._initRender())
}
