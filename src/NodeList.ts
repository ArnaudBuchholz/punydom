import {
  NodeList
} from './types'

export class NodeListImpl<T> extends Array<T> implements NodeList<T> {
  item (index: number): T | null {
    return this[index] ?? null
  }
}
