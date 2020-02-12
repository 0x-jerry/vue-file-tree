import vue from 'vue'
import { configs } from './config'

export interface TreeItemOption {
  name: string;
  type: TreeItemType;
  parent: TreeItem;
  describe: string;
}

export type TreeItemType = 'folder' | 'file' | TreeItemTypeEnum

export enum TreeItemTypeEnum {
  folder = 'folder',
  file = 'file',
}

export class TreeItem {
  type: TreeItemType
  name: string
  parent?: TreeItem
  children: TreeItem[]
  expand: boolean
  active: boolean
  describe: string

  constructor (options: Partial<TreeItemOption> = {}) {
    this.type = options.type || TreeItemTypeEnum.folder

    const defualtName = this.isFolder ? configs.newFolderDefaultName : configs.newFileDefaultName
    this.name = options.name || defualtName

    this.parent = options.parent
    this.active = false
    this.expand = false
    this.describe = options.describe || ''

    this.children = []
  }

  get depth () {
    let parent = this.parent

    let depth = 0

    while (parent) {
      parent = parent.parent
      depth++
    }

    return depth
  }

  get uri () {
    let path = this.name

    let parent = this.parent
    while (parent) {
      path = parent.name + '/' + path
      parent = parent.parent
    }

    return '/' + path
  }

  get isFolder () {
    return this.type === TreeItemTypeEnum.folder
  }
}

export class TreeManager {
  model: TreeItem[]

  currentActive?: TreeItem

  constructor () {
    this.model = vue.observable([])
  }

  find (predicate: (item: TreeItem) => boolean) {
    const findInChildren = (model: { children: TreeItem[] }, predicate: (item: TreeItem) => boolean): TreeItem | void => {
      let getIt: TreeItem | void = model.children.find(predicate)
      if (getIt) return getIt

      for (const child of model.children) {
        getIt = findInChildren(child, predicate)
        if (getIt) return getIt
      }
    }

    return findInChildren({ children: this.model }, predicate)
  }

  active (item?: TreeItem) {
    if (this.currentActive) {
      this.currentActive.active = false
    }

    if (item) {
      item.active = true
      this.currentActive = item
    }
  }

  replace (items: TreeItem[]) {
    this.model.splice(0)
    this.model.push(...items)
    this.sort()
  }

  checkDuplicate (list: TreeItem[], item: TreeItem) {
    const has = list.find(m => m.name === item.name && m.type === item.type)

    if (has) {
      window.alert(`Duplicate ${item.type} [${item.name}]`)
    }

    return has
  }

  add (item: TreeItem) {
    if (this.currentActive) {
      if (this.currentActive.isFolder) {
        if (this.checkDuplicate(this.currentActive.children, item)) {
          return
        }

        this.currentActive.children.push(item)
        this.currentActive.expand = true
        item.parent = this.currentActive
      } else {
        if (this.currentActive.parent) {
          if (this.checkDuplicate(this.currentActive.parent.children, item)) {
            return
          }

          this.currentActive.parent.children.push(item)
          this.currentActive.parent.expand = true
          item.parent = this.currentActive.parent
        } else {
          if (this.checkDuplicate(this.model, item)) {
            return
          }
          this.model.push(item)
        }
      }
    } else {
      if (this.checkDuplicate(this.model, item)) {
        return
      }
      this.model.push(item)
    }
    this.sort()
  }

  private _sort (models: TreeItem[], parent: TreeItem | null, dec: boolean) {
    models.sort((a, b) => (dec ? 1 : -1) * (a.name + a.type > b.name + b.type ? -1 : 1))

    for (const child of models) {
      child.parent = parent || undefined

      if (child.isFolder && child.children.length) {
        this._sort(child.children, child, dec)
      }
    }
  }

  sort (dec = false) {
    this._sort(this.model, null, dec)
  }

  toggleExpand (item: TreeItem) {
    item.expand = !item.expand
  }

  remove (item: TreeItem) {
    if (!item) return
    const children = (item.parent && item.parent.children) || this.model

    item.parent = undefined
    const idx = children.indexOf(item)
    if (idx >= 0) {
      return children.splice(idx, 1)
    }

    return null
  }

  move (fromItem?: TreeItem, toItem?: TreeItem) {
    if (!fromItem) {
      return
    }

    if (!toItem) {
      if (fromItem.parent) {
        this.remove(fromItem)
        this.model.push(fromItem)
      }
      return
    }

    if (fromItem.parent === toItem) {
      return
    }

    if (fromItem === toItem) {
      return
    }

    if (toItem.isFolder) {
      if (!this.checkDuplicate(toItem.children, fromItem)) {
        this.remove(fromItem)
        fromItem.parent = toItem
        toItem.children.push(fromItem)
      }
    } else {
      if (fromItem.parent === toItem.parent) {
        return
      }

      if (toItem.parent) {
        if (!this.checkDuplicate(toItem.parent.children, fromItem)) {
          this.remove(fromItem)
          fromItem.parent = toItem.parent
          toItem.parent.children.push(fromItem)
        }
      } else {
        if (!this.checkDuplicate(this.model, fromItem)) {
          this.remove(fromItem)
          this.model.push(fromItem)
        }
      }
    }
  }
}

export const tree = new TreeManager()

window.addEventListener('keydown', (e) => {
  if (e.key === 'Delete' && tree.currentActive) {
    if (window.confirm(`Delete file [${tree.currentActive.name}] ?`)) {
      tree.remove(tree.currentActive)
      tree.active()
    }
  }
})
