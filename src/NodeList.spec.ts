import { NodeListImpl } from './NodeList'

describe('NodeList', () => {
  it('implements Array<Node>', () => {
    const nodeList = new NodeListImpl()
    expect(nodeList).toBeInstanceOf(Array)
    expect(nodeList.length).toStrictEqual(0)
  })
})
