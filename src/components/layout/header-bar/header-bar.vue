<template>
  <div class="header-bar">
    <sider-trigger :collapsed="collapsed" icon="md-menu" @on-change="handleCollpasedChange"></sider-trigger>
    <custom-bread-crumb style="margin-left: 30px;" :full-path="fullPath" :menu-list="menuList"></custom-bread-crumb>
    <div class="custom-content-con">
      <slot></slot>
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
      fullPath: String,
      menuList: {
        type: Array,
        default: () => []
      }
    },
    methods: {
      handleCollpasedChange (state) {
        this.$emit('on-coll-change', state)
      }
    }
  }
</script>
