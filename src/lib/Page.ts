import { Component } from './Component'
import { ElementNode } from './elements'

type PageURLSearchParams = Record<string, string>

interface PageProps {
  isDynamic?: boolean
}

export abstract class Page<
  P extends PageURLSearchParams = PageURLSearchParams
> {
  readonly path: string
  readonly isDynamic: boolean
  readonly subPages: (typeof Page)[]

  abstract Body: Component | ElementNode

  constructor(
    path: string,
    subPages: (typeof Page)[] = [],
    options?: PageProps
  ) {
    const { isDynamic = false } = options || {}

    this.path = path
    this.isDynamic = isDynamic
    this.subPages = subPages
  }

  _createPageParams(params: P) {
    const searchParams = new URLSearchParams()

    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        searchParams.append(key, params[key])
      }
    }

    return searchParams
  }

  _createURLPath(parent?: string) {
    return parent ? `${parent}/${this.path}` : this.path
  }
}
