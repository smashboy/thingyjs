import { Page } from '../lib/Page'
import { Title } from '../lib/elements/Title'

export class HomePage extends Page {
  Body = Title('Home')

  constructor() {
    super('/')
  }
}
