<template>
  <el-link :underline="false" href="javascript:void(0)" @click="handleChange" class="sider-trigger-link">
    <el-icon size="20">
      <component v-bind:is="collapsed?'el-icon-expand':'el-icon-fold'"></component>
    </el-icon>
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
