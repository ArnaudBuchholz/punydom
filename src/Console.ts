import { PunyDOMSettings } from './types'

export class Console {
  constructor (
    private readonly _settings: PunyDOMSettings
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
