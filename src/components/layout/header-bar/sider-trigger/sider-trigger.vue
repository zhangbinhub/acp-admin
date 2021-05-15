<template>
  <el-link :underline="false" href="javascript:void(0)" @click="handleChange" class="sider-trigger-link">
    <i :class="collapsed?'el-icon-s-unfold':'el-icon-s-fold'"/>
  </el-link>
</template>
<script>
import './sider-trigger.less'

export default {
  name: 'siderTrigger',
  props: {
    collapsed: Boolean
  },
  methods: {
    handleChange() {
      this.$emit('on-change', !this.collapsed)
    }
  }
}
</script>
