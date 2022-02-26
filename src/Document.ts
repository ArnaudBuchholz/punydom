import {
  Window,
  Document,
  Node,
  NodeType,
  Element
} from './types'
import { NodeImpl } from './Node'
import { ElementImpl } from './Element'

export class DocumentImpl extends ElementImpl {
  constructor (
    _window: Window
  ) {
    super(_window, NodeType.DOCUMENT_NODE)
    const html = this.createElement('html')
    this.appendChild(html)
    const head = this.createElement('head')
    html.appendChild(head)
    const body = this.createElement('body')
    html.appendChild(body)
  }

  createComment (): Node {
    return new NodeImpl(this._window, NodeType.COMMENT_NODE)
  }

  createDocumentFragment (): Element {
    return new ElementImpl(this._window, NodeType.DOCUMENT_FRAGMENT_NODE)
  }

  createElement (name: string): Element {
    return new ElementImpl(this._window, NodeType.ELEMENT_NODE, name)
  }

  get defaultView (): Window {
    return this._window
  }

  get documentElement (): Document {
    return this
  }

  getElementById (id: string): Element | null {
    const nodeImpl = this._getSelfAndAllChildren()
      .find(node => node.isElement() && node.id === id)
    if (nodeImpl !== undefined) {
      return nodeImpl.asElement()
    }
    return null
  }

  get hidden (): boolean {
    return true
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

[
  'head',
  'body'
].forEach(name => Object.defineProperty(Document.prototype, name, {
  get: function () {
    return this.getElementsByTagName(name)[0]
  }
}))

export interface DocumentImpl extends Document {}
