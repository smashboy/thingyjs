import { App } from './lib/App'
import { NavigationController } from './lib/NavigationController'
import { elementsPresentation } from './lib/elementsPresentation'
import { AuthPage } from './pages/Auth.page'
import { HomePage } from './pages/Landing.page'

import './lib/elements/theme.css'

class NetflixCloneApp extends App {
  readonly navigationController = new NavigationController()

  constructor() {
    super()

    this.navigationController.addPage(HomePage)
    this.navigationController.addPage(AuthPage)
  }
}

const app = new NetflixCloneApp()

const root = document.getElementById('app')!

// app.render(document.getElementById('app')!)

root.appendChild(elementsPresentation._getElement())
