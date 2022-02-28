import {
  Console,
  Window
} from './types'

export class ConsoleImpl implements Console {
  constructor (
    protected readonly _window: Window
  ) {}

  log (...params: any[]): void {
    console.log(...params)
  }

  warn (...params: any[]): void {
    console.warn(...params)
  }

  error (...params: any[]): void {
    console.error(...params)
  }
}
