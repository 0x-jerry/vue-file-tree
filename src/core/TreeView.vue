<template>
  <div class="tree-explorer">
    <div class="tree-title-bar">
      <div class="tree-explorer-title">{{title}}</div>
      <div class="tree-explorer-actions">
        <button class="icon" @click="createNewFile">+</button>
        <button class="icon" @click="createNewFolder">(x)</button>
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
    tree.model.splice(0)
    tree.model.push(...this.tree)

    return {
      rootChildren: tree.model
    }
  },
  methods: {
    createNewFile () {
      const uid = Math.random()
        .toString(16)
        .substr(2)
      tree.create(new TreeItem({ name: uid + '.js', type: 'file' }))
    },
    createNewFolder () {
      const uid = Math.random()
        .toString(16)
        .substr(2)
      tree.create(new TreeItem({ name: uid, type: 'folder' }))
    }
  }
}
</script>

<style lang="less">
.tree-explorer {
  width: 200px;
  height: 600px;
  background: #191c20;
  color: white;
  font-size: 14px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;

  &-title {
    color: #dae1f7;
  }

  &-actions {
    flex: 1;
    text-align: right;
  }
}

.tree-title-bar {
  padding: 5px 10px;
  display: flex;
  align-items: center;
  background: #282c34;
}

.tree-content {
  height: 100%;
  overflow-y: auto;
  overflow: hidden;
}
</style>
