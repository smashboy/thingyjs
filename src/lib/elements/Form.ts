import { createNodeFunction } from '../utils'
import { ElementNode } from './Element'

export class FormNode extends ElementNode<'form'> {
  constructor(onSubmit: (event: SubmitEvent) => void) {
    super('form')

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
