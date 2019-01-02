<template>
  <div class="side-menu-wrapper">
    <slot></slot>
    <div class="menu-area" v-show="!collapsed">
      <Menu ref="menu" :active-name="activeName" :open-names="openedNames" :accordion="accordion"
            :theme="theme" width="auto" @on-select="handleSelect">
        <template v-for="item in menuList">
          <side-menu-item v-if="item.children && item.children.length > 0" :key="`menu-${item.id}`"
                          :parent-item="item"></side-menu-item>
          <menu-item v-else :name="item.path" :key="`menu-${item.id}`">
            <Icon :type="item.icon_type"></Icon>
            <span>{{ item.name }}</span>
          </menu-item>
        </template>
      </Menu>
    </div>
    <div class="menu-area menu-collapsed" v-show="collapsed" :list="menuList">
      <template v-for="item in menuList">
        <collapsed-menu v-if="item.children && item.children.length > 0" @on-click="handleSelect" :hide-title="true"
                        :root-icon-size="30" :icon-size="16" :parent-item="item" :is-root="true"
                        :key="`drop-menu-${item.id}`"></collapsed-menu>
        <Tooltip transfer v-else :content="item.name"
                 placement="right" :key="`drop-menu-${item.id}`">
          <a @click="handleSelect(item.path)" class="drop-menu-a"
             :style="{textAlign: 'center'}">
            <Icon :type="item.icon_type" :size="30"></Icon>
          </a>
        </Tooltip>
      </template>
    </div>
  </div>
</template>
<script>
  import { getOpenedNamesByActiveName } from '@/libs/tools'
  import SideMenuItem from './side-menu-item.vue'
  import CollapsedMenu from './collapsed-menu.vue'

  export default {
    name: 'SideMenu',
    components: {
      SideMenuItem,
      CollapsedMenu
    },
    props: {
      menuList: {
        type: Array,
        default () {
          return []
        }
      },
      collapsed: {
        type: Boolean
      },
      theme: String,
      accordion: Boolean,
      activeName: {
        type: String,
        default: ''
      },
      openNames: {
        type: Array,
        default: () => []
      }
    },
    data () {
      return {
        openedNames: []
      }
    },
    methods: {
      handleSelect (path) {
        this.$emit('on-select', path)
      },
      updateMenuStatus () {
        this.$nextTick(() => {
          this.$refs.menu.updateOpened()
          this.$refs.menu.updateActiveName()
        })
      }
    },
    watch: {
      menuList () {
        this.openedNames = this.openedNames.concat(getOpenedNamesByActiveName(this.activeName, this))
      },
      activeName (name) {
        if (this.accordion) {
          this.openedNames = getOpenedNamesByActiveName(name, this)
        } else {
          this.openedNames = this.openedNames.concat(getOpenedNamesByActiveName(name, this))
        }
      },
      openNames (newNames) {
        this.openedNames = newNames
      },
      openedNames () {
        this.updateMenuStatus()
      }
    }
  }
</script>
<style lang="less">
  @import './side-menu.less';
</style>
