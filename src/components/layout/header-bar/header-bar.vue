<template>
  <div class="header-bar">
    <sider-trigger :collapsed="collapsed" v-show="!mini&&!isMobile" @on-change="handleCollpasedChange"/>
    <custom-bread-crumb style="margin-left: 10px;" v-show="!mini&&!isMobile"
                        :full-path="fullPath"
                        :menu-list="menuList"/>
    <img v-show="isMobile" :src="minLogo" alt="" style="height: 60px;margin-left: 5px;"/>
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
    isMobile: Boolean,
    fullPath: String,
    menuList: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    minLogo() {
      return require('@/assets/images/logo/logo-main-light.png')
    }
  },
  methods: {
    handleCollpasedChange(state) {
      this.$emit('on-coll-change', state)
    }
  }
}
</script>
