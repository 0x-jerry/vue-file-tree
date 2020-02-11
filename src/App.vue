<template>
  <div id="app">
    <tree-view :tree="tree" title="tree test" />
  </div>
</template>

<script>
import TreeView from './core/TreeView.vue'
import { TreeItem } from './core/model'

export default {
  name: 'App',
  components: {
    TreeView
  },
  computed: {
    tree () {
      const root = new TreeItem({ name: 'test', type: 'folder' })
      const file = new TreeItem({ name: 'xx.ts', type: 'file' })

      root.expand = true
      root.children.push(file)

      file.parent = root

      return [
        root,
        new TreeItem({ name: 'test.js', type: 'folder' }),
        new TreeItem({ name: 'test.js', type: 'file' }),
        new TreeItem({ name: 'xx.md', type: 'file' })
      ]
    }
  }
}
</script>

<style lang="less">
html,
div {
  padding: 0;
  margin: 0;
}
</style>
