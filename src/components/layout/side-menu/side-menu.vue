<template>
  <div class="side-menu-wrapper">
    <el-container v-show="!isMobile" class="side-menu-content">
      <el-main>
        <el-scrollbar ref="menuScrollbar" class="menu-scrollbar">
          <el-menu :collapse="collapsed" :default-active="activeName" :default-openeds="openedNames"
                   :unique-opened="accordion"
                   active-text-color="#409eff"
                   background-color="#1f2d3d"
                   class="menu-root"
                   text-color="rgba(255, 255, 255, 0.7)"
                   @select="handleSelect">
            <template v-for="item in menuList">
              <side-menu-item v-if="item.children && item.children.length > 0" :key="item.id+'_parent'"
                              :parent-item="item"/>
              <el-menu-item v-else :key="item.id" :index="item.path">
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
        <sider-trigger v-show="!isMobile" :collapsed="collapsed" @on-change="handleMenuFold"/>
      </el-footer>
    </el-container>
    <el-menu v-show="isMobile" :collapse="false" :default-active="activeName" :unique-opened="accordion"
             active-text-color="#409eff"
             background-color="#1f2d3d"
             class="menu-root"
             menu-trigger="click"
             mode="horizontal"
             text-color="rgba(255, 255, 255, 0.7)"
             @select="handleSelect">
      <template v-for="item in menuList">
        <side-menu-item v-if="item.children && item.children.length > 0" :key="item.id+'_parent'"
                        :parent-item="item"/>
        <el-menu-item v-else :key="item.id" :index="item.path">
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
