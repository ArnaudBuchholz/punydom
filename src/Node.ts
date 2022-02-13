import { EventTarget } from './EventTarget'
import { NodeListImpl } from './NodeList'
import {
  Window,
  Node,
  NodeList,
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

  _cloneNode (): Node {
    return new NodeImpl(this._window, this._nodeType)
  }

  cloneNode (deep: boolean = false): Node {
    const clone = this._cloneNode()
    const cloneImpl: NodeImpl = impl(clone)
    if (deep) {
      this._children.forEach((child: Node) => cloneImpl._children.push(child.cloneNode(true)))
    }
    return clone
  }

  get firstChild (): Node | null {
    return this._children[0] ?? null
  }

  _getSelfAndAllChildren (): NodeImpl[] {
    return this._children
      .map((node): NodeImpl => impl(node))
      .reduce((result: NodeImpl[], node: NodeImpl): NodeImpl[] => [...result, ...node._getSelfAndAllChildren()], [this])
  }

  get _hierarchy (): NodeImpl[] {
    const hierarchy: NodeImpl[] = [this]
    let node = this._parent
    while (node !== null) {
      hierarchy.unshift(node)
      node = node._parent
    }
    return hierarchy
  }

  insertBefore (node: Node, refNode: Node): Node {
    const nodeImpl: NodeImpl = impl(node)
    if (nodeImpl._parent !== null) {
      // TODO detach from parent
    }
    nodeImpl._parent = this
    const pos = this._children.indexOf(refNode)
    this._children.splice(pos, 0, node)
    return node
  }

  get lastChild (): Node | null {
    const length = this._children.length
    if (length !== 0) {
      return this._children[length - 1]
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
