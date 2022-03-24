export const XHTML_NAMESPACE = 'http://www.w3.org/1999/xhtml'

export interface Navigator {
  userAgent: string
  platform: string
}

export interface Console {
  log: (...args: any[]) => void
  warn: (...args: any[]) => void
  error: (...args: any[]) => void
}

export interface Window {
  console: Console
  document: Document
  eval: (code: string) => any
  location: URL
  navigator: Navigator
  readonly parent: Window | null
  readonly self: Window
  readonly top: Window
  setTimeout: (callback: Function, delay: number) => number
  clearTimeout: (timeoutId: number) => void
  setInterval: (callback: Function, delay: number) => number
  clearInterval: (intervalId: number) => void
}

export interface Node {
  appendChild: (node: Node) => Node
  readonly childNodes: NodeList<Node>
  cloneNode: (deep?: boolean) => Node
  readonly firstChild: Node | null
  insertBefore: (node: Node, refNode: Node) => Node
  readonly lastChild: Node | null
  readonly nextSibling: Node | null
  readonly nodeType: NodeType
  nodeValue: string | null
  readonly ownerDocument: Document | null
  readonly parentNode: Node | null
  readonly previousSibling: Node | null
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

export interface Element extends Node {
  readonly classList: ClassList
  className: string
  readonly dataset: object
  getAttribute: (name: string) => string | null
  getBoundingClientRect: () => DOMRect
  innerHTML: string
  readonly localName: string
  readonly namespaceURI: string
  readonly nodeName: string
  querySelector: (selector: string) => Element | null
  querySelectorAll: (selector: string) => NodeList<Element>
  setAttribute: (name: string, value: string) => void
  readonly tagName: string
  textContent: string
  id: string
  style: string
  href: string
  src: string
}

export interface Document extends Element {
  createComment: () => Node
  createDocumentFragment: () => Element
  createElement: (name: string) => Element
  readonly defaultView: Window
  readonly documentElement: Document
  getElementById: (id: string) => Element | null
  readonly hidden: boolean
  readonly location: URL
  readonly readyState: string
  readonly head: Element | null
  readonly body: Element | null
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
  baseURL: 'http://localhost'
}

export function impl<T, I> (obj: T): I {
  return obj as unknown as I
}
