import { createNodeFunction } from '../utils'
import { ElementNode } from './Element'

export class FormNode extends ElementNode<'form'> {
  constructor(onSubmit?: (event: SubmitEvent) => void) {
    super('form')

    if (onSubmit) {
      this.onSubmit(onSubmit)
    }
  }

  onSubmit(onSubmit: (event: SubmitEvent) => void) {
    this.listen('submit', (event: SubmitEvent) => {
      event.preventDefault()
      onSubmit(event)
    })
  }
}

export const Form = createNodeFunction<typeof FormNode, FormNode>(
  // @ts-ignore
  FormNode
)
