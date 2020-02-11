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
   * @type {TreeItem[]}
   */
  replace (items) {
    this.model.splice(0)
    this.model.push(...items)
    this.sort()
  },
  /**
   *
   * @param {TreeItem} item
   */
  add (item) {
    const checkDuplicate = (list, item) => {
      const has = list.find(m => m.name === item.name && m.type === item.type)

      if (has) {
        window.alert(`Duplicate ${item.type} [${item.name}]`)
      }

      return has
    }

    if (this.currentActive) {
      if (this.currentActive.isFolder) {
        if (checkDuplicate(this.currentActive.children, item)) {
          return
        }

        this.currentActive.children.push(item)
        this.currentActive.expand = true
        item.parent = this.currentActive
      } else {
        if (this.currentActive.parent) {
          if (checkDuplicate(this.currentActive.parent.children, item)) {
            return
          }

          this.currentActive.parent.children.push(item)
          this.currentActive.parent.expand = true
          item.parent = this.currentActive.parent
        } else {
          if (checkDuplicate(this.model, item)) {
            return
          }
          this.model.push(item)
        }
      }
    } else {
      if (checkDuplicate(this.model, item)) {
        return
      }
      this.model.push(item)
    }
    this.sort()
  },
  /**
   * @param {TreeItem[]} models
   * @param {TreeItem|null} parent
   * @param {boolean} dec
   */
  _sort (models, parent, dec) {
    models.sort((a, b) => (dec ? 1 : -1) * (a.name + a.type > b.name + b.type ? -1 : 1))

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
  },
  /**
   *
   * @param {TreeItem} item
   */
  remove (item) {
    if (!item) return
    const children = (item.parent && item.parent.children) || this.model

    const idx = children.indexOf(item)
    if (idx >= 0) {
      return children.splice(idx, 1)
    }

    return null
  }
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Delete' && tree.currentActive) {
    if (window.confirm(`Delete file [${tree.currentActive.name}] ?`)) {
      tree.remove(tree.currentActive)
      tree.active(null)
    }
  }
})
