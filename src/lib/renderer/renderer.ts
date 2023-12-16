import { Component } from '../Component'
import { createHTMLElement } from './element'
import { patchTree } from './patcher'

export class Renderer {
  private element!: HTMLElement
  private componentRef: Component

  constructor(component: Component) {
    this.componentRef = component
  }

  rerender() {
    console.log(
      'UPDATE',
      this.element,
      this.componentRef,
      this.componentRef.render()
    )
    if (!this.element) return
    this.element = patchTree(this.element, this.componentRef.render())
  }

  _initRender() {
    this.element = createHTMLElement(this.componentRef.render()._getNode())
    console.log('INIT', this.element, this.componentRef)
    return this.element
  }
}

export default function render(root: HTMLElement, app: Component) {
  if (!root) {
    throw new Error('Please provide a valid entry for your application')
  }

  root.appendChild(app._renderer._initRender())
}
