import vue from 'vue'
import { configs } from './config'

const TreeItemType = {
  folder: 'folder',
  file: 'file'
}

/**
 * @type {import('../index').TreeItem}
 */
export class TreeItem {
  /**
   *
   * @param {Partial<import('../index').TreeItemOption>} [options]
   */
  constructor (options = {}) {
    this.type = options.type || TreeItemType.folder

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
    return this.type === TreeItemType.folder
  }
}

export const tree = {
  /**
   * @type {TreeItem[]}
   */
  model: vue.observable([]),
  /**
   * @type {TreeItem}
   */
  currentActive: null,
  /**
   *
   * @param {TreeItem} item
   */
  active (item) {
    if (this.currentActive) {
      this.currentActive.active = false
    }
    if (item) {
      item.active = true
      this.currentActive = item
    }
  },
  /**
   *
   * @param {Partial<import('../index').TreeItemOption>} [options]
   */
  create (options) {
    const item = new TreeItem(options)
    this.model.push(item)
    this.sort()
  },
  /**
   * @param {TreeItem[]} models
   * @param {TreeItem|null} parent
   * @param {boolean} dec
   */
  _sort (models, parent, dec) {
    models.sort((a, b) => (dec ? 1 : -1) * (a.name > b.name ? -1 : 1))

    for (const child of models) {
      child.parent = parent

      if (child.isFolder && child.children.length) {
        this._sort(child.children, child, dec)
      }
    }
  },
  sort (dec = false) {
    this._sort(this.model, null, dec)
  },
  /**
   *
   * @param {TreeItem} item
   */
  toggleExpand (item) {
    item.expand = !item.expand
  }
}
