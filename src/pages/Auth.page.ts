import { Page } from '../lib/Page'
import { Button } from '../lib/elements'

export class AuthPage extends Page {
  Body = Button('Login')

  constructor() {
    super('/auth')
  }
}
