import { EventTarget } from './EventTarget'
import { NodeListImpl } from './NodeList'
import { DOMException } from './DOMException'
import { WindowImpl } from './Window'
import {
  Window,
  Document,
  Node,
  NodeList,
  NodeType,
  PunyDOMSettings,
  DEFAULT_SETTINGS,
  impl
} from './types'

export class NodeImpl extends EventTarget implements Node {
  private _parent: NodeImpl | null = null
  private readonly _children: NodeListImpl<Node> = new NodeListImpl<Node>()
  private _nodeValue: string = ''

  protected get punyDOMSettings (): PunyDOMSettings {
    if (this._window instanceof WindowImpl) {
      return this._window.punyDOMSettings
    }
    return DEFAULT_SETTINGS
  }

  constructor (
    protected readonly _window: Window,
    protected readonly _nodeType: NodeType
  ) {
    super()
  }

  appendChild (node: Node): Node {
    const nodeImpl: NodeImpl = impl(node)
    nodeImpl._parent = this
    this._children.push(node)
    return node
  }

  get childNodes (): NodeList<Node> {
    return this._children
  }

  protected _cloneNode (): Node {
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

  protected _getSelfAndAllChildren (): NodeImpl[] {
    return this._children
      .map((node): NodeImpl => impl(node))
      .reduce((result: NodeImpl[], node: NodeImpl): NodeImpl[] => [...result, ...node._getSelfAndAllChildren()], [this])
  }

  protected get _hierarchy (): NodeImpl[] {
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

  get nextSibling (): Node | null {
    const parent = this._parent
    if (parent !== null) {
      const parentChildren = parent._children
      const pos = parentChildren.indexOf(this) + 1
      if (pos !== 0 && pos < parentChildren.length) {
        return parentChildren[pos]
      }
    }
    return null
  }

  get nodeType (): NodeType {
    return this._nodeType
  }

  protected get _hasValue (): boolean {
    return [
      NodeType.TEXT_NODE,
      NodeType.ATTRIBUTE_NODE,
      NodeType.PROCESSING_INSTRUCTION_NODE,
      NodeType.COMMENT_NODE
    ].includes(this._nodeType)
  }

  get nodeValue (): string | null {
    if (this._hasValue) {
      return this._nodeValue
    }
    return null
  }

  set nodeValue (value: string | null) {
    if (this._hasValue) {
      this._nodeValue = value ?? ''
    }
  }

  get ownerDocument (): Document | null {
    if (this._window !== null) {
      return this._window.document
    }
    return null
  }

  get parentNode (): Node | null {
    return this._parent ?? null
  }

  get previousSibling (): Node | null {
    const parent = this._parent
    if (parent !== null) {
      const parentChildren = parent._children
      const pos = parentChildren.indexOf(this) - 1
      if (pos >= 0) {
        return parentChildren[pos]
      }
    }
    return null
  }

  removeChild (node: Node): Node {
    const pos = this._children.indexOf(node)
    if (pos === -1) {
      throw new DOMException('NotFoundError')
    }
    this._children.splice(pos, 1)
    return node
  }

  _toHTML (): string {
    if (this._nodeType === NodeType.COMMENT_NODE) {
      return `<!--${this._nodeValue}-->`
    }
    if (this._hasValue) {
      return this._nodeValue
    }
    return [
      this._toHTMLOpen(),
      ...this._children.map((node: Node) => {
        const nodeImpl: NodeImpl = impl(node)
        return nodeImpl._toHTML()
      }),
      this._toHTMLClose()
    ].join('')
  }

  protected _toHTMLOpen (): string {
    return ''
  }

  protected _toHTMLClose (): string {
    return ''
  }
}
