<template>
  <div class="header-bar">
    <img :src="mainLogo" alt="" class="header-bar-logo"/>
    <custom-bread-crumb v-show="!mini&&!isMobile" :full-path="fullPath" :menu-list="menuList"/>
    <div class="custom-content-con">
      <slot/>
    </div>
  </div>
</template>
<script>
import customBreadCrumb from './custom-bread-crumb'
import './header-bar.less'

export default {
  name: 'HeaderBar',
  components: {
    customBreadCrumb
  },
  props: {
    mini: Boolean,
    isMobile: Boolean,
    fullPath: String,
    menuList: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    mainLogo() {
      return require('@/assets/images/logo/logo-main-' + this.$store.state.app.appInfo.theme + '.png')
    }
  }
}
</script>
