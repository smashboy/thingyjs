import { ElementNode } from './elements'

interface TComponent {
  readonly Body: ElementNode
  onInit?: () => void
  onDestroy?: () => void
}

export abstract class Component implements TComponent {
  abstract readonly Body: ElementNode
}
