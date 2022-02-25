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

export class ElementImpl extends NodeImpl implements Element {
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
    const attributes = this._attributes
    const value = attributes[name]
    if (value !== undefined) {
      return value
    }
    // case insensitive version
    const lowerName = name.toLowerCase()
    const attName = Object.keys(attributes)
      .find(key => key.toLowerCase() === lowerName)
    if (attName !== undefined) {
      return attributes[attName]
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

  setAttribute (name, value) {
    this[$attributes][name] = value.toString()
  }

  get style () {
    return this[$style]
  }

  get tagName () {
    return this[$name]
  }

  get textContent () {
    return this._getSelfAndAllChildren()
      .filter(node => node[$nodeType] === Node.TEXT_NODE)
      .map(node => node.nodeValue)
      .join('')
  }

  set textContent (value) {
    this._clearChildren()
    if (value) {
      const text = new Node(this[$window], Node.TEXT_NODE)
      text.nodeValue = value
      this.appendChild(text)
    }
  }

  protected _toHTMLOpen (): string {
    const attributes = this[$attributes]
    return `<${this[$name]}${Object.keys(attributes).map(name => ` ${name}="${attributes[name]}"`).join('')}>`
  }

  protected _toHTMLClose (): string {
    return `</${this._name}>`
  }
}

// Map some attributes directly as properties
[
  'href',
  'id',
  'src'
].forEach(name => {
  Object.defineProperty(Element.prototype, name, {
    get: function () {
      return this.getAttribute(name)
    },
    set: function (value) {
      this.setAttribute(name, value)
    }
  })
})


const someProxy = new Proxy({}, {
  get(target: object, prop: sring | number | symbol) {
    return target[prop];
  }
});