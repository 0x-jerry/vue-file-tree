<template>
  <div class="tree-explorer" @click="handleExplorerClick">
    <div class="tree-title-bar">
      <div class="tree-explorer-title">{{title}}</div>
      <div class="tree-explorer-actions">
        <button class="tree-explorer-icon" @click="createNewFile">+</button>
        <button class="tree-explorer-icon" @click="createNewFolder">(x)</button>
      </div>
    </div>
    <nested-item :children="rootChildren" class="tree-content" />
  </div>
</template>

<script>
import NestedItem from './NestedItem'
import { TreeItem, tree } from './model'

export default {
  props: {
    title: String,
    tree: {
      default: () => [],
      type: Array
    }
  },
  components: {
    NestedItem
  },
  data () {
    tree.replace(this.tree)

    return {
      rootChildren: tree.model
    }
  },
  methods: {
    createNewFile () {
      const name = window.prompt('please input name')
      tree.add(new TreeItem({ name, type: 'file' }))
    },
    createNewFolder () {
      const name = window.prompt('please input name')
      tree.add(new TreeItem({ name, type: 'folder' }))
    },
    handleExplorerClick (e) {
      if (e.target === e.currentTarget) {
        tree.active(null)
      }
    }
  }
}
</script>

<style lang="less">
.tree-explorer {
  width: 300px;
  height: 600px;
  background: #191c20;
  color: white;
  font-size: 14px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;

  &-title {
    color: #dae1f7;
    height: 100%;
  }

  &-actions {
    flex: 1;
    text-align: right;
    height: 100%;
  }

  &-icon {
    height: 100%;
    border: none;
    background: transparent;
    color: #dae1f7;
    outline: none;

    &:hover {
      background: #191c20;
    }
  }
}

.tree-title-bar {
  padding: 0 10px;
  height: 25px;
  display: flex;
  align-items: center;
  background: #282c34;
}

.tree-content {
  overflow-y: auto;
  overflow-x: hidden;
  max-height: calc(100% - 25px);
}
</style>
