<template>
  <el-sub-menu :index="`${this.parentItem.id}`">
    <template #title>
      <i :class="this.parentItem.iconType"/>
      <span>{{ this.parentItem.name }}</span>
    </template>
    <template v-for="item in this.parentItem.children">
      <side-menu-item v-if="item.children && item.children.length > 0" :parent-item="item"/>
      <el-menu-item v-else :index="item.path">
        <i :class="item.iconType"/>
        <template #title>{{ item.name }}</template>
      </el-menu-item>
    </template>
  </el-sub-menu>
</template>
<script>
export default {
  name: 'SideMenuItem',
  props: {
    parentItem: {
      type: Object,
      default: () => {
      }
    }
  }
}
</script>
