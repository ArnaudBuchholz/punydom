import { PunyDOM } from './PunyDOM'
import { Element } from './types'

describe('ClassList', () => {
  let body: Element

  beforeEach(() => {
    const punydom = new PunyDOM({
      baseURL: 'http://localhost'
    })
    const { window } = punydom
    if (window.document.body === null) {
      throw new Error('Unexpected null body')
    } else {
      body = window.document.body
    }
  })

  it('checks if class is defined (empty)', () => {
    expect(body.classList.contains('a')).toStrictEqual(false)
  })

  it('checks if class is defined (a b c)', () => {
    body.className = 'a b c'
    expect(body.classList.contains('a')).toStrictEqual(true)
    expect(body.classList.contains('c')).toStrictEqual(true)
    expect(body.classList.contains('d')).toStrictEqual(false)
  })

  it('adds new class names', () => {
    body.className = ''
    body.classList.add('a')
    body.classList.add('b')
    expect(body.className).toStrictEqual('a b')
  })

  it('does not add duplicates', () => {
    body.className = 'a b'
    body.classList.add('c')
    body.classList.add('a')
    expect(body.className).toStrictEqual('a b c')
  })

  it('removes class names', () => {
    body.className = 'a b'
    body.classList.remove('b')
    expect(body.className).toStrictEqual('a')
  })

  it('ignores non existing class names', () => {
    body.className = 'a b'
    body.classList.remove('c')
    expect(body.className).toStrictEqual('a b')
  })
})
