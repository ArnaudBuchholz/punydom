import {
  XHTML_NAMESPACE,
  Window,
  ClassList,
  DOMRect,
  Element,
  NodeType,
  Node,
  NodeList,
  impl
} from './types'
import { ClassListImpl } from './ClassList'
import { NodeImpl } from './Node'
import { NodeListImpl } from './NodeList'

type Attributes = Record<string, string>
type NamespacePrefixes = Record<string, string>

function getNamespacePrefixAndBaseName (name: string): {
  namespacePrefix: string
  baseName: string
} {
  let namespacePrefix = ''
  let baseName = ''
  if (name !== '') {
    const pos = name.indexOf(':')
    if (pos === -1) {
      baseName = name
    } else {
      namespacePrefix = name.substring(0, pos)
      baseName = name.substring(pos + 1)
    }
  }
  return {
    namespacePrefix,
    baseName
  }
}

export class ElementImpl extends NodeImpl {
  private readonly _attributes: Attributes = {}

  constructor (
    _window: Window,
    _nodeType: NodeType = NodeType.ELEMENT_NODE,
    private readonly _name: string = ''
  ) {
    super(_window, _nodeType)
  }

  private _classList!: ClassListImpl

  get classList (): ClassList {
    if (this._classList === undefined) {
      this._classList = new ClassListImpl(this)
    }
    return this._classList
  }

  get className (): string {
    return this.getAttribute('class') ?? ''
  }

  set className (value: string) {
    this.setAttribute('class', value)
  }

  protected _cloneNode (): NodeImpl {
    const clone = new ElementImpl(this._window, this._nodeType, this._name)
    Object.assign(clone._attributes, this._attributes)
    return clone
  }

  private _dataset!: object

  get dataset (): object {
    if (this._dataset === undefined) {
      this._dataset = new Proxy({}, {
        get: (obj, name: string | number | Symbol) => this.getAttribute('data-' + name.toString()),
        set: (obj, name: string | number | Symbol, value: any) => {
          this.setAttribute('data-' + name.toString(), value.toString())
          return true
        }
      })
    }
    return this._dataset
  }

  getAttribute (name: string): string | null {
    const lowerName = name.toLowerCase()
    const attName = Object.keys(this._attributes)
      .find(key => key.toLowerCase() === lowerName)
    if (attName !== undefined) {
      return this._attributes[attName]
    }
    return null
  }

  getBoundingClientRect (): DOMRect {
    return {
      get left () { return 0 },
      get top () { return 0 },
      get right () { return 0 },
      get bottom () { return 0 },
      get x () { return 0 },
      get y () { return 0 },
      get width () { return 0 },
      get height () { return 0 }
    }
  }

  get innerHTML (): string {
    return this.childNodes
      .map((node: Node) => {
        const nodeImpl: NodeImpl = impl(node)
        return nodeImpl._toHTML()
      })
      .join('')
  }

  set innerHTML (value: string) {
    throw new Error('Not implemented')
  }

  get localName (): string {
    return getNamespacePrefixAndBaseName(this._name).baseName
  }

  get _namespacePrefixes (): NamespacePrefixes {
    const namespacePrefix = 'xmlns:'
    const namespaceAttribute = 'xmlns'
    return this._hierarchy
      .map((node: NodeImpl): NamespacePrefixes => {
        if (node instanceof ElementImpl) {
          const attributes = node._attributes
          return Object.keys(attributes)
            .filter(name => name.startsWith(namespacePrefix) || name === namespaceAttribute)
            .reduce((prefixes: NamespacePrefixes, name: string): NamespacePrefixes => {
              if (name === namespaceAttribute) {
                prefixes[''] = attributes[name]
              } else {
                prefixes[name.substring(namespacePrefix.length)] = attributes[name]
              }
              return prefixes
            }, {})
        }
        return {}
      })
      .reduce((consolidated, dictionary) => {
        return { ...consolidated, ...dictionary }
      }, {
        '': XHTML_NAMESPACE,
        xmlns: 'http://www.w3.org/2000/xmlns/'
      })
  }

  get namespaceURI (): string {
    return this._namespacePrefixes[getNamespacePrefixAndBaseName(this._name).namespacePrefix]
  }

  get nodeName (): string {
    return this._name
  }

  querySelector (selector: string): Element | null {
    return this.querySelectorAll(selector)[0] ?? null
  }

  querySelectorAll (selector: string): NodeList<Element> {
    const nodeList = new NodeListImpl<Element>()
    if (this.punyDOMSettings.querySelectorAll !== undefined) {
      const elements = this.punyDOMSettings.querySelectorAll(this, selector)
      nodeList.push(...elements)
    }
    return nodeList
  }

  setAttribute (name: string, value: string): void {
    this._attributes[name.toLocaleLowerCase()] = value.toString()
  }

  get tagName (): string {
    return this._name
  }

  get textContent (): string {
    return this._getSelfAndAllChildren()
      .filter(node => node.nodeType === NodeType.TEXT_NODE)
      .map(node => node.nodeValue)
      .join('')
  }

  set textContent (value: string) {
    this._children.length = 0
    if (value !== '') {
      const text = new NodeImpl(this._window, NodeType.TEXT_NODE)
      text.nodeValue = value
      this.appendChild(text)
    }
  }

  protected _toHTMLOpen (): string {
    return `<${this._name}${Object.keys(this._attributes).map(name => ` ${name}="${this._attributes[name]}"`).join('')}>`
  }

  protected _toHTMLClose (): string {
    return `</${this._name}>`
  }
}

[
  'id',
  'style',
  'href',
  'src'
].forEach(name => {
  Object.defineProperty(ElementImpl.prototype, name, {
    get: function (): string {
      return this.getAttribute(name)
    },
    set: function (value: string): void {
      this.setAttribute(name, value)
    }
  })
})

export interface ElementImpl extends Element {}
