import { EventTarget } from './EventTarget'
import { NodeListImpl } from './NodeList'
import {
  Window,
  Node,
  NodeType,
  impl
} from './types'

export class NodeImpl extends EventTarget implements Node {
  private _parent: NodeImpl | null = null
  private readonly _children: NodeListImpl = new NodeListImpl()

  constructor (
    private readonly _window: Window,
    private readonly _nodeType: NodeType
  ) {
    super()
  }

  appendChild (node: Node): Node {
    const nodeImpl: NodeImpl = impl(node)
    nodeImpl._parent = this
    this._children.push(node)
    return node
  }

  get childNodes (): NodeList {
    return this._children
  }

  _cloneNode (): NodeImpl {
    return new NodeImpl(this._window, this._nodeType)
  }

  cloneNode (deep: boolean = false): NodeImpl {
    const clone = this._cloneNode()
    if (deep) {
      this._children.forEach((child: Node) => clone._children.push(child.cloneNode(true)))
    }
    return clone
  }

  get firstChild (): NodeImpl | null {
    return this._children[0] ?? null
  }

  _getSelfAndAllChildren () {
    return this[$childNodes].reduce((result, child) => [...result, ...child._getSelfAndAllChildren()], [this])
  }

  get _hierarchy () {
    const hierarchy = []
    let node = this
    while (node) {
      hierarchy.unshift(node)
      node = node[$parent]
    }
    return hierarchy
  }

  insertBefore (node, refNode) {
    node[$parent] = this
    const pos = this[$childNodes].indexOf(refNode)
    this[$childNodes].splice(pos, 0, node)
  }

  get lastChild () {
    const length = this[$childNodes].length
    if (length) {
      return this[$childNodes][length - 1]
    }
    return null
  }

  get nextSibling () {
    const parent = this[$parent]
    if (parent) {
      const parentChildren = parent[$childNodes]
      const pos = parentChildren.indexOf(this) + 1
      if (pos && pos < parentChildren.length) {
        return parentChildren[pos]
      }
    }
    return null
  }

  get nodeType () {
    return this[$nodeType]
  }

  _hasValue () {
    return [
      Node.TEXT_NODE,
      Node.ATTRIBUTE_NODE,
      Node.PROCESSING_INSTRUCTION_NODE,
      Node.COMMENT_NODE
    ].includes(this[$nodeType])
  }

  get nodeValue () {
    if (this._hasValue()) {
      return this[$nodeValue] || ''
    }
    return null
  }

  set nodeValue (value) {
    if (this._hasValue()) {
      this[$nodeValue] = value
    }
  }

  _onNewChild (node) {
    if (this[$parent]) {
      this[$parent]._onNewChild(node)
    }
  }

  get ownerDocument () {
    if (this[$window]) {
      return this[$window].document
    }
    return null
  }

  get parentNode () {
    return this[$parent] || null
  }

  get previousSibling () {
    const parent = this[$parent]
    if (parent) {
      const parentChildren = parent[$childNodes]
      const pos = parentChildren.indexOf(this) - 1
      if (pos >= 0) {
        return parentChildren[pos]
      }
    }
    return null
  }

  removeChild (node) {
    const pos = this[$childNodes].indexOf(node)
    if (pos !== -1) {
      this[$childNodes].splice(pos, 1)
    }
  }

  _toHTML () {
    if (this[$nodeType] === Node.COMMENT_NODE) {
      return `<!--${this[$nodeValue]}-->`
    }
    if (this._hasValue()) {
      return this[$nodeValue]
    }
    return [
      this._toHTMLOpen(),
      ...this[$childNodes].map(node => node._toHTML()),
      this._toHTMLClose()
    ].join('')
  }

  _toHTMLClose () {}

  _toHTMLOpen () {}

  get value () {
    return this.nodeValue
  }

  set value (value) {
    this.nodeValue = value
  }
}
