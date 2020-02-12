<template>
  <div class="tree-item" :class="{ selected }" @click="clickTreeItem">
    <span class="tree-item-indent" :style="indentStyle"></span>
    <span
      class="tree-item-icon"
      :class="{ 'tree-item-expand-icon': model.isFolder, expand: model.expand }"
    ></span>
    <img class="tree-item-icon" :src="icon" alt srcset />
    <span class="tree-item-title">{{model.name}}</span>
    <span class="tree-item-describe">{{model.describe}}</span>
    <div class="tree-item-tail-bar"></div>
  </div>
</template>

<script>
import { tree } from './model'
import { resolveIconName } from './icons'
import { configs } from './config'

export default {
  props: {
    model: Object
  },
  computed: {
    icon () {
      const name = resolveIconName({
        name: this.model.name,
        isFolder: this.model.isFolder,
        isOpen: this.model.expand
      })

      return `${configs.iconFolderPath}/${name}`
    },
    selected () {
      return this.model.active
    },
    indentStyle () {
      return {
        paddingLeft: this.model.depth * 20 + 'px'
      }
    }
  },
  watch: {
    expand (newVal) {
      this.expandStatus = !!newVal
    }
  },
  methods: {
    clickTreeItem () {
      this.activeCurrent()

      if (this.model.isFolder) {
        tree.toggleExpand(this.model)
      }
    },
    activeCurrent () {
      tree.active(this.model)
    }
  }
}
</script>

<style lang="less">
.tree-item {
  display: flex;
  align-items: center;
  padding: 2px;

  * {
    user-select: none;
  }

  img {
    -webkit-user-drag: none;
  }

  &.selected {
    background: #2c313a;
  }

  &:hover {
    background: #292d35;
  }

  &-indent {
    height: 100%;
  }

  &-icon {
    display: block;
    width: 18px;
    height: 100%;
    padding-right: 3px;
  }

  &-expand-icon {
    position: relative;
    &::before {
      content: "+";
      position: absolute;
      transform: translate(-50%, -60%);
      top: 50%;
      left: 50%;
    }

    &.expand {
      &::before {
        content: "-";
      }
    }
  }

  &-title {
    color: #f1f1f1;
    margin-right: 4px;
    flex: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  &-describe {
    font-size: smaller;
    color: #dbdbdb;
  }
}
</style>
