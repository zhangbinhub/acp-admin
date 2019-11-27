<template>
  <div class="side-menu-wrapper">
    <slot/>
    <el-scrollbar ref="menu-scrollbar" class="menu-scrollbar">
      <el-menu class="menu-root" :collapse="collapsed" :unique-opened="accordion"
               background-color="#1f2d3d"
               text-color="rgba(255, 255, 255, 0.7)"
               active-text-color="#409eff"
               :default-active="activeName"
               :default-openeds="openedNames"
               @select="handleSelect">
        <template v-for="item in menuList">
          <side-menu-item v-if="item.children && item.children.length > 0" :parent-item="item"/>
          <el-menu-item v-else :index="item.path">
            <i :class="item.iconType"/>
            <span slot="title">{{item.name}}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-scrollbar>
  </div>
</template>
<script>
  import { getOpenedNamesByActiveName } from '@/libs/tools'
  import SideMenuItem from './side-menu-item.vue'

  export default {
    name: 'SideMenu',
    components: {
      SideMenuItem
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
      }
    },
    computed: {
      mainHeight () {
        return this.$store.state.app.mainHeight
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
      mainHeight () {
        this.$nextTick(() => {
          this.$refs['menu-scrollbar'].update()
        })
      }
    }
  }
</script>
<style lang="less">
  @import './side-menu.less';
</style>
