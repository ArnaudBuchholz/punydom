import {
  Window,
  PunyDOMSettings
} from './types'
import { WindowImpl } from './Window'

export class PunyDOM {
  constructor (
    private readonly _settings: PunyDOMSettings
  ) {}

  get settings (): PunyDOMSettings {
    return this._settings
  }

  private _window: WindowImpl | null = null

  get window (): Window {
    if (this._window === null) {
      this._window = new WindowImpl(this._settings)
    }
    return this._window
  }
}
