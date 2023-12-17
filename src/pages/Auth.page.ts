import { Page } from '../lib/Page'
import { Title } from '../lib/elements/Title'

export class AuthPage extends Page {
  Body = Title('Auth')

  constructor() {
    super('/auth')
  }
}
