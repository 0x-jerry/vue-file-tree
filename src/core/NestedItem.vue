
<template>
  <div class="drag-area">
    <div v-for="el in children" :key="el.name+el.type">
      <tree-item :model="el"  />
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

<style scoped lang="less">
.drag-area {
  width: 100%;
}

.drag-item {
  list-style: none;
}
</style>
