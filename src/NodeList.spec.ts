import { NodeListImpl } from './NodeList'

describe('NodeList', () => {
  it('implements Array<Node>', () => {
    const nodeList = new NodeListImpl()
    expect(nodeList instanceof Array).toStrictEqual(true)
    expect(nodeList.length).toStrictEqual(0)
  })
})
