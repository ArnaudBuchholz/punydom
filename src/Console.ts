import { Settings } from './Settings'

export class Console {
  constructor (
    private readonly _settings: Settings
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
