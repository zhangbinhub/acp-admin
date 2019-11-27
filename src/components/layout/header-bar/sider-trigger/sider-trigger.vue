<template>
  <el-link :underline="false" @click="handleChange" class="sider-trigger-link">
    <i :class="collapsed?'el-icon-s-unfold':'el-icon-s-fold'"/>
  </el-link>
</template>
<script>
  export default {
    name: 'siderTrigger',
    props: {
      collapsed: Boolean
    },
    methods: {
      handleChange () {
        this.$emit('on-change', !this.collapsed)
      }
    }
  }
</script>
<style lang="less">
  @import './sider-trigger.less';
</style>
