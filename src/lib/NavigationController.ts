import { Page } from './Page'
import { getHTMLElementRef } from './utils'

export class NavigationController {
  private readonly pagesMapByPath: Map<string, Page> = new Map()
  private readonly pages: Set<typeof Page> = new Set()

  addPage(page: typeof Page, parentPath?: string) {
    // @ts-ignore
    const pageInit = new page() as Page

    const pagePath = pageInit._createURLPath(parentPath)

    this.pages.add(page)
    this.pagesMapByPath.set(pagePath, pageInit)

    for (const subPage of pageInit.subPages) {
      this.addPage(subPage, pagePath)
    }
  }

  init(root: HTMLElement) {
    const page = this.pagesMapByPath.get(window.location.pathname)

    if (page) {
      root.appendChild(getHTMLElementRef(page.Body))
      return
    }

    root.appendChild(document.createTextNode('Page not found'))
  }
}
