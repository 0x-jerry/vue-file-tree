export interface TreeItemOption {
  name: string
  type: 'folder' | 'file'
  parent: TreeItem,
  describe:string
}

export class TreeItem {
  name: string
  active: boolean
  describe: string
  type: 'folder' | 'file'

  parent?: TreeItem
  children: TreeItem[]

  new(options?: Partial<TreeItemOption>): TreeItem

  constructor(options?: Partial<TreeItemOption>)

  readonly uri: string

  readonly isFolder: boolean
}