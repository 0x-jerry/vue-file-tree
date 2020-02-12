<template>
  <div id="app">
    <tree-view :tree="tree" title="Test Project" />
  </div>
</template>

<script>
import { TreeView } from './entry'

export default {
  components: {
    TreeView
  },
  computed: {
    tree () {
      return [
        {
          name: 'test',
          type: 'folder',
          expand: true,
          children: [
            { name: 'xx.ts', type: 'file' },
            { name: 'xx.sh', type: 'file' }
          ]
        },
        {
          name: 'test.js',
          type: 'folder',
          expand: true,
          children: [
            { name: 'test.vue', type: 'file', active: true }
          ]
        },
        { name: 'test.js', type: 'file' },
        { name: 'xx.md', type: 'file' }
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
