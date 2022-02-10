import { Window } from './Window'
import { ClassList } from './ClassList'
import { Node, NodeType } from './Node'

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

export class Element extends Node {
  private readonly _attributes: Record<string, string>

  constructor (
    private readonly _window: Window,
    private readonly _name: string = '',
    private readonly _nodeType: NodeType = NodeType.ELEMENT_NODE
  ) {
    super(_window, _nodeType)
    this._attributes = {}
  }

  private _classList!: ClassList

  get classList (): ClassList {
    if (this._classList === undefined) {
      this._classList = new ClassList(this._window, this)
    }
    return this._classList
  }

  get className (): string {
    return this.getAttribute('class') ?? ''
  }

  set className (value: string) {
    this.setAttribute('class', value)
  }

  protected _cloneNode (): Node {
    const clone = new Element(this._window, this._name, this._nodeType)
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

  getAttribute (name: string): string | undefined {
    const attributes = this._attributes
    const value = attributes[name]
    if (value !== undefined) {
      return value
    }
    // case insensitive version
    const keys = Object.keys(attributes)
    const lowerKeys = keys.map(key => key.toLowerCase())
    const pos = lowerKeys.indexOf(name.toLowerCase())
    if (pos !== -1) {
      return attributes[keys[pos]]
    }
  }

  getBoundingClientRect (): {
    left: number
    top: number
    right: number
    bottom: number
    x: number
    y: number
    width: number
    height: number
  } {
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
      .map(node => node._toHTML())
      .join('')
  }

  get localName (): string {
    return getNamespacePrefixAndBaseName(this[$name]).baseName
  }

  get _namespacePrefixes () {
    const namespacePrefix = 'xmlns:'
    const namespaceAttribute = 'xmlns'
    return this._hierarchy
      .map(node => {
        const attributes = node[$attributes] || {}
        return Object.keys(attributes)
          .filter(name => name.startsWith(namespacePrefix) || name === namespaceAttribute)
          .reduce((prefixes, name) => {
            if (name === namespaceAttribute) {
              prefixes[''] = attributes[name]
            } else {
              prefixes[name.substring(namespacePrefix.length)] = attributes[name]
            }
            return prefixes
          }, {})
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

  querySelector (selector) {
    if (selector === 'SCRIPT[src][id=sap-ui-bootstrap]') {
      return this._getSelfAndAllChildren()
        .filter(node => node[$nodeType] === Node.ELEMENT_NODE &&
                        node.getAttribute('src') &&
                        node.id === 'sap-ui-bootstrap')[0] || null
    }
    return null
  }

  querySelectorAll () {
    return []
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

  _toHTMLClose () {
    return `</${this[$name]}>`
  }

  _toHTMLOpen () {
    const attributes = this[$attributes]
    return `<${this[$name]}${Object.keys(attributes).map(name => ` ${name}="${attributes[name]}"`).join('')}>`
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