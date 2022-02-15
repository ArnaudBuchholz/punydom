export interface Window {
  document: Document
  location: URL
}

export interface Document {

}

export interface Node {
  appendChild: (node: Node) => Node
  childNodes: NodeList
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

export interface NodeList extends Array<Node> {
  item: (index: number) => Node | null
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

export interface Element {
  getAttribute: (name: string) => string
  setAttribute: (name: string, value: string) => void
}

export interface Event {
  type: string
}

export interface Settings {
  baseURL: string
  userAgent?: string
  platform?: string
  querySelectorAll?: (root: Node, selector: string) => Node[]
}

export function impl<T, I> (obj: T): I {
  return obj as unknown as I
}
