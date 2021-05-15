<template>
  <div class="header-bar">
    <sider-trigger :collapsed="collapsed" v-show="!mini" @on-change="handleCollpasedChange"/>
    <custom-bread-crumb style="margin-left: 10px;" v-show="!mini"
                        :full-path="fullPath"
                        :menu-list="menuList"/>
    <div class="custom-content-con">
      <slot/>
    </div>
  </div>
</template>
<script>
import siderTrigger from './sider-trigger'
import customBreadCrumb from './custom-bread-crumb'
import './header-bar.less'

export default {
  name: 'HeaderBar',
  components: {
    siderTrigger,
    customBreadCrumb
  },
  props: {
    collapsed: Boolean,
    mini: Boolean,
    fullPath: String,
    menuList: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    handleCollpasedChange(state) {
      this.$emit('on-coll-change', state)
    }
  }
}
</script>
