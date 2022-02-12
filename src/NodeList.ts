import {
  NodeList,
  Node
} from './types'

export class NodeListImpl extends Array<Node> implements NodeList {
  item (index: number): Node | null {
    return this[index] ?? null
  }
}
