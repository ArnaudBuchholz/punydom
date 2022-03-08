import { PunyDOM } from './PunyDOM'
import { WindowImpl } from './Window'

describe('PunyDOM', () => {
  let punydom: PunyDOM

  beforeAll(() => {
    punydom = new PunyDOM({
      baseURL: 'http://localhost'
    })
  })

  it('offers the main entry point', () => {
    const { window } = punydom
    expect(window).toBeInstanceOf(WindowImpl)
  })

  it('exposes the creation options', () => {
    expect(punydom.settings).toMatchObject({
      baseURL: 'http://localhost'
    })
  })
})
