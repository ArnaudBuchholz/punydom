import { Settings } from './Settings'
import { Window } from './Window'
import { Element } from './Element'
import { Node } from './Node'

class Document extends Element {
  constructor (
    private readonly _window: Window,
    private readonly _settings: Settings
  ) {
    super(_window, undefined, Node.DOCUMENT_NODE)
    const html = this.createElement('html')
    this.appendChild(html)
    const head = this.createElement('head')
    html.appendChild(head)
    const body = this.createElement('body')
    html.appendChild(body)
  }

  createComment (): Node {
    return new Node(this._window, Node.COMMENT_NODE)
  }

  createDocumentFragment (): Element {
    return new Element(this._window, undefined, Node.DOCUMENT_FRAGMENT_NODE)
  }

  createElement (name: string): Element {
    return new Element(this._window, name)
  }

  get defaultView (): Window {
    return this._window
  }

  get documentElement (): Document {
    return this
  }

  getElementById (id: string): Node | null {
    return this._getSelfAndAllChildren().filter(node => node.nodeType === Node.ELEMENT_NODE && node.id === id)[0] || null
  }

  get hidden (): boolean {
    return true
  }

  get implementation (): unknown {
    return {
      createHTMLDocument: () => {
        return new Document(this._window, this._settings)
      }
    }
  }

  get location (): URL {
    return this._window.location
  }

  get nodeName (): string {
    return '#document'
  }

  get readyState (): string {
    return 'complete'
  }
}

// Shortcuts to elements
[
  'body',
  'head'
].forEach(name => Object.defineProperty(Document.prototype, name, {
  get: function () {
    return this.getElementsByTagName(name)[0]
  },
  set: () => false
}))