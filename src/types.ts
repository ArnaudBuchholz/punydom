export interface IWindow {
  
}

export interface INode {
  
}

export interface IElement {
  getAttribute: (name: string) => string
  setAttribute: (name: string, value: string) => void
}

export interface Settings {
  baseURL: string
  userAgent?: string
  platform?: string
  querySelectorAll?: (root: INode, selector: string) => INode[]
}
