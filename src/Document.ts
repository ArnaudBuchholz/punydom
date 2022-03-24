import {
  Window,
  Document,
  Node,
  NodeList,
  NodeType,
  Element
} from './types'
import { NodeImpl } from './Node'
import { ElementImpl } from './Element'

function elementByTagName (nodes: NodeList<Node>, localName: string): Element | null {
  const elements: Element[] = nodes.filter(node => node.nodeType === NodeType.ELEMENT_NODE) as Element[]
  return elements.find(element => element.localName === localName) ?? null
}

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

  get body (): Element | null {
    const html = elementByTagName(this.childNodes, 'html')
    if (html !== null) {
      return elementByTagName(html.childNodes, 'body')
    }
    return null
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

  get head (): Element | null {
    const html = elementByTagName(this.childNodes, 'html')
    if (html !== null) {
      return elementByTagName(html.childNodes, 'body')
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

export interface DocumentImpl extends Document {}
