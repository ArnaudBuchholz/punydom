import { IElement } from './types'

export class ClassList {
  constructor (
    private readonly _element: IElement
  ) {}

  add (...classNames: string[]): void {
    classNames.forEach(className => {
      if (!this.contains(className)) {
        this._classNames += ' ' + className
      }
    })
  }

  get _classNames (): string {
    return this._element.getAttribute('class')
  }

  set _classNames (value: string) {
    this._element.setAttribute('class', value)
  }

  contains (className: string): boolean {
    return this._classNames.split(' ').includes(className)
  }

  remove (...classNames: string[]): void {
    this._classNames = this._classNames
      .split(' ')
      .filter(className => !classNames.includes(className))
      .join(' ')
  }
}
