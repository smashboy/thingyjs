import { App } from './lib/App'
import { NavigationController } from './lib/NavigationController'
import { AuthPage } from './pages/Auth.page'
import { HomePage } from './pages/Landing.page'

class NetflixCloneApp extends App {
  readonly navigationController = new NavigationController()

  constructor() {
    super()

    this.navigationController.addPage(HomePage)
    this.navigationController.addPage(AuthPage)
  }
}

const app = new NetflixCloneApp()

app.render(document.getElementById('app')!)
