
<template>
  <div class="tree-nested-item">
    <div v-for="el in children" :key="el.name+el.type" class="tree-highlight-item" tree-highlight-item>
      <tree-item :model="el" />
      <nested-item v-if="el.isFolder && el.expand" :children="el.children" />
    </div>
  </div>
</template>

<script>
import TreeItem from './TreeItem'
import { tree } from './model'

export default {
  name: 'nested-item',
  components: {
    TreeItem
  },
  props: {
    children: {
      required: true,
      type: Array,
      default: () => []
    }
  },
  methods: {
    treeChanged () {
      tree.sort()
    }
  }
}
</script>

<style lang="less">
.tree-nested-item {
  width: 100%;
}
</style>
