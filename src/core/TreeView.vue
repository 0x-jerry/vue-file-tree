<template>
  <div class="tree-explorer" @click="handleExplorerClick">
    <div class="tree-title-bar">
      <div class="tree-explorer-title">{{title}}</div>
      <div class="tree-explorer-actions">
        <button class="tree-explorer-icon" @click="createNewFile">+</button>
        <button class="tree-explorer-icon" @click="createNewFolder">(x)</button>
      </div>
    </div>
    <nested-item
      :children="rootChildren"
      tree-highlight-item
      class="tree-content tree-highlight-item"
      @drop.native.prevent="drop"
      @dropover.native.prevent
      @dragover.native.prevent
      @dragenter.native="dargEnter"
    />
  </div>
</template>

<script>
import NestedItem from './NestedItem'
import { TreeItem, tree } from './model'

function findNearestTreeHighlightItem (el) {
  while (el) {
    if (el.hasAttribute('tree-highlight-item')) {
      return el
    } else {
      el = el.parentElement
    }
  }
}

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
      rootChildren: tree.model,
      dropInEl: null
    }
  },
  methods: {
    drop (e) {
      if (e.target !== e.currentTarget) {
        return
      }

      const uri = e.dataTransfer.getData('text')
      const model = tree.find(m => m.uri === uri)

      tree.move(model, null)

      const el = findNearestTreeHighlightItem(e.target)
      if (el) {
        el.classList.remove('highlight')
      }
      this.dropInEl = null
    },
    dargEnter (e) {
      const el = findNearestTreeHighlightItem(e.target)
      if (this.dropInEl) {
        this.dropInEl.classList.remove('highlight')
      }

      if (el) {
        this.dropInEl = el
        el.classList.add('highlight')
      }
    },
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
@explorer-title-bar-heihgt: 25px;

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
    display: flex;
    align-items: center;
  }

  &-actions {
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
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
  height: @explorer-title-bar-heihgt;
  display: flex;
  align-items: center;
  background: #282c34;
}

.tree-content {
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100% - @explorer-title-bar-heihgt);
}

.tree-highlight-item {
  &.highlight {
    background: #383e4a;
  }
}
</style>
