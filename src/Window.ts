import {
  Window,
  PunyDOMSettings,
  DEFAULT_SETTINGS
} from './types'
import { Document } from './Document'
import { DOMParser } from './DOMParser'
import { EventTarget } from './EventTarget'
import { FormData } from './FormData'
import { Node } from './Node'

export class WindowImpl extends EventTarget implements Window {
  get Document (): Function {
    return Document
  }

  get DOMParser (): Function {
    return DOMParser
  }

  get FormData (): Function {
    return FormData
  }

  get JSON (): JSON {
    return JSON
  }

  get Node (): Function {
    return Node
  }

  get URL (): Function {
    return URL
  }

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
      securedContext.call(this, this, this) // global also set to window because of sinon
    } catch (e) {
      console.error(e)
      return false
    }
    return true
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

  get navigator (): { userAgent: string, platform: string } {
    return {
      userAgent: this._settings.userAgent ?? 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.2 (KHTML, like Gecko) Chrome/22.0.1216.0 Safari/537.2',
      platform: this._settings.platform ?? 'Node.js'
    }
  }

  get pageXOffset (): number {
    return 0
  }

  get pageYOffset (): number {
    return 0
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

// Members allocated when requested
const dynamicMembers = [{
  name: 'console',
  symbol: $console,
  Class: require('./Console')
}, {
  name: 'document',
  symbol: $document,
  Class: Document
}, {
  name: 'history',
  symbol: $history,
  Class: require('./History')
}, {
  name: 'localStorage',
  symbol: $localStorage,
  Class: require('./LocalStorage')
}]

dynamicMembers.forEach(member => {
  Object.defineProperty(Window.prototype, member.name, {
    get: function () {
      if (!this[member.symbol]) {
        this[member.symbol] = new member.Class(this)
      }
      return this[member.symbol]
    },
    set: () => false
  })
})

// Overridable members
const overridableMembers = [{
  name: 'setTimeout',
  initial: setTimeout
}, {
  name: 'clearTimeout',
  initial: clearTimeout
}, {
  name: 'setInterval',
  initial: setInterval
}, {
  name: 'clearInterval',
  initial: clearInterval
}]

overridableMembers.forEach(member => {
  const symbol = Symbol(member.name)
  Object.defineProperty(Window.prototype, member.name, {
    get: function () {
      if (!this[symbol]) {
        this[symbol] = member.initial
      }
      return this[symbol]
    },
    set: function (value) {
      this[symbol] = value
    }
  })
})

module.exports = Window
