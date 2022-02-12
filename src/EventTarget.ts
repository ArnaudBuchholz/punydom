import { Event } from './types'

export class EventTarget {
  constructor (
    private readonly _events: Record<string, Function[]> = {}
  ) {}

  addEventListener (type: string, eventHandler: Function): void {
    if (this._events[type] === undefined) {
      this._events[type] = []
    }
    this._events[type].push(eventHandler)
  }

  removeEventListener (type: string, eventHandler: Function): void {
    if (this._events[type] !== undefined) {
      const index = this._events[type].indexOf(eventHandler)
      if (index !== -1) {
        this._events[type].splice(index, 1)
      }
    }
  }

  dispatchEvent (event: Event): void {
    const type = event.type
    if (this._events[type] !== undefined) {
      this._events[type].forEach(eventHandler => eventHandler(this))
    }
  }
}
