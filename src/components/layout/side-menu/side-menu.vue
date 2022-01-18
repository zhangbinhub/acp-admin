<template>
  <div class="side-menu-wrapper">
    <el-container class="side-menu-content" v-show="!isMobile">
      <el-main>
        <el-scrollbar ref="menuScrollbar" class="menu-scrollbar">
          <el-menu class="menu-root" :collapse="collapsed" :unique-opened="accordion"
                   background-color="#1f2d3d"
                   text-color="rgba(255, 255, 255, 0.7)"
                   active-text-color="#409eff"
                   :default-active="activeName"
                   :default-openeds="openedNames"
                   @select="handleSelect">
            <template v-for="item in menuList">
              <side-menu-item v-if="item.children && item.children.length > 0" :parent-item="item"
                              :key="item.id+'_parent'"/>
              <el-menu-item v-else :index="item.path" :key="item.id">
                <el-icon>
                  <component v-bind:is="'el-icon-'+item.iconType"></component>
                </el-icon>
                <template #title>{{ item.name }}</template>
              </el-menu-item>
            </template>
          </el-menu>
        </el-scrollbar>
      </el-main>
      <el-footer>
        <sider-trigger :collapsed="collapsed" v-show="!isMobile" @on-change="handleMenuFold"/>
      </el-footer>
    </el-container>
    <el-menu class="menu-root" :collapse="false" :unique-opened="accordion" v-show="isMobile"
             background-color="#1f2d3d"
             text-color="rgba(255, 255, 255, 0.7)"
             mode="horizontal"
             menu-trigger="click"
             active-text-color="#409eff"
             :default-active="activeName"
             @select="handleSelect">
      <template v-for="item in menuList">
        <side-menu-item v-if="item.children && item.children.length > 0" :parent-item="item"
                        :key="item.id+'_parent'"/>
        <el-menu-item v-else :index="item.path" :key="item.id">
          <el-icon>
            <component v-bind:is="'el-icon-'+item.iconType"></component>
          </el-icon>
          <template #title>{{ item.name }}</template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>
<script>
import siderTrigger from './sider-trigger'
import {ref} from 'vue'
import {getOpenedNamesByActiveName} from '@/libs/tools'
import SideMenuItem from './side-menu-item.vue'
import './side-menu.less'

export default {
  name: 'SideMenu',
  components: {
    siderTrigger,
    SideMenuItem
  },
  props: {
    menuList: {
      type: Array,
      default() {
        return []
      }
    },
    collapsed: {
      type: Boolean
    },
    isMobile: {
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
  data() {
    return {
      openedNames: []
    }
  },
  methods: {
    handleSelect(path) {
      this.$emit('on-select', path)
    },
    handleMenuFold(state) {
      if (state) {
        this.$store.commit('CLOSE_SLIDEBAR')
      } else {
        this.$store.commit('OPEN_SLIDEBAR')
      }
    }
  },
  watch: {
    menuList() {
      this.openedNames = this.openedNames.concat(getOpenedNamesByActiveName(this.activeName, this))
    },
    activeName(name) {
      if (this.accordion) {
        this.openedNames = getOpenedNamesByActiveName(name, this)
      } else {
        this.openedNames = this.openedNames.concat(getOpenedNamesByActiveName(name, this))
      }
    },
    openNames(newNames) {
      this.openedNames = newNames
    }
  },
  setup() {
    const menuScrollbar = ref(null)
    return {menuScrollbar}
  }
}
</script>
