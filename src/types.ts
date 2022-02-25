export const XHTML_NAMESPACE = 'http://www.w3.org/1999/xhtml'

export interface Window {
  document: Document
  location: URL
}

export interface Document {

}

export interface Node {
  appendChild: (node: Node) => Node
  childNodes: NodeList<Node>
  cloneNode: (deep?: boolean) => Node
  firstChild: Node | null
  insertBefore: (node: Node, refNode: Node) => Node
  lastChild: Node | null
  nextSibling: Node | null
  nodeType: NodeType
  nodeValue: string | null
  ownerDocument: Document | null
  parentNode: Node | null
  previousSibling: Node | null
  removeChild: (node: Node) => Node
}

export interface NodeList<T> extends Array<T> {
  item: (index: number) => T | null
}

export enum NodeType {
  ELEMENT_NODE = 1,
  ATTRIBUTE_NODE = 2,
  TEXT_NODE = 3,
  PROCESSING_INSTRUCTION_NODE = 7,
  COMMENT_NODE = 8,
  DOCUMENT_NODE = 9,
  DOCUMENT_TYPE_NODE = 10,
  DOCUMENT_FRAGMENT_NODE = 11
}

export interface ClassList {
  add: (...classNames: string[]) => void
  contains: (className: string) => boolean
  remove: (...classNames: string[]) => void
}

export interface DOMRect {
  left: number
  top: number
  right: number
  bottom: number
  x: number
  y: number
  width: number
  height: number
}

export interface Element {
  classList: ClassList
  className: string
  dataset: object
  getAttribute: (name: string) => string | null
  getBoundingClientRect: () => DOMRect
  innerHTML: string
  readonly localName: string
  readonly namespaceURI: string
  readonly nodeName: string
  querySelector: (selector: string) => Element | null
  querySelectorAll: (selector: string) => NodeList<Element>
  setAttribute: (name: string, value: string) => void
}

export interface Event {
  type: string
}

export interface PunyDOMSettings {
  baseURL: string
  userAgent?: string
  platform?: string
  querySelectorAll?: (root: Element, selector: string) => Element[]
}

export const DEFAULT_SETTINGS: PunyDOMSettings = {
  baseURL: 'http://localhost',
  userAgent: 'simulated',
  platform: 'simulated'
}

export function impl<T, I> (obj: T): I {
  return obj as unknown as I
}
