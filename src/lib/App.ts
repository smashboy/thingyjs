import { NavigationController } from './NavigationController'

export abstract class App {
  abstract readonly navigationController: NavigationController

  render(root: HTMLElement) {
    this.navigationController.init(root)
  }
}
