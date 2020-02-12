import Vue from 'vue/types/umd'
import { TreeItemOption } from './src/core/model'

export { TreeItem, TreeItemOption, TreeItemType, TreeManager, tree } from './src/core/model'

export class TreeView extends Vue {
  tree?: TreeItemOption[]
}
