import {
  Navigator,
  Window,
  PunyDOMSettings,
  DEFAULT_SETTINGS
} from './types'
import { EventTarget } from './EventTarget'
import { ConsoleImpl } from './Console'
import { DocumentImpl } from './Document'

export class WindowImpl extends EventTarget implements Window {
  get punyDOMSettings (): PunyDOMSettings {
    return this._settings
  }

  constructor (
    private readonly _settings: PunyDOMSettings = DEFAULT_SETTINGS
  ) {
    super()
    this._location = new URL(this._settings.baseURL)
  }

  eval (code: string): any {
    // Create a secure context
    const params = ['window', 'global', 'require']
    let securedContext
    try {
      securedContext = Function.apply(null, params.concat(`with (window) {\n${code}\n}`))
    } catch (e) {
      console.error(e)
      return false
    }
    try {
      return securedContext.call(this, this, this) // global also set to window because of sinon
    } catch (e) {
      console.error(e)
    }
  }

  private _location: URL

  set location (value: URL | string) {
    if (typeof value === 'string') {
      this._location = new URL(value)
    } else {
      this._location = value
    }
  }

  get location (): URL {
    return this._location
  }

  get navigator (): Navigator {
    return {
      userAgent: this._settings.userAgent ?? 'PunyDOM',
      platform: this._settings.platform ?? 'PunyDOM'
    }
  }

  get parent (): Window | null {
    return null
  }

  get self (): Window {
    return this
  }

  get top (): Window {
    if (this.parent !== null) {
      return this.parent.top
    }
    return this
  }
}

const dynamicMembers = [{
  name: 'console',
  symbol: Symbol('console'),
  Class: ConsoleImpl
}, {
  name: 'document',
  symbol: Symbol('document'),
  Class: DocumentImpl
}]

dynamicMembers.forEach(member => {
  Object.defineProperty(WindowImpl.prototype, member.name, {
    get: function () {
      if (this[member.symbol] === undefined) {
        this[member.symbol] = new member.Class(this)
      }
      return this[member.symbol]
    },
    set: () => false
  })
})

Object.assign(WindowImpl.prototype, {
  setTimeout,
  clearTimeout,
  setInterval,
  clearInterval
})

export interface WindowImpl extends Window {}
