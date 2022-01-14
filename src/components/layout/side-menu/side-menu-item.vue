<template>
  <el-sub-menu :index="`${this.parentItem.id}`">
    <template #title>
      <el-icon>
        <component v-bind:is="'el-icon-'+this.parentItem.iconType"></component>
      </el-icon>
      <span>{{ this.parentItem.name }}</span>
    </template>
    <template v-for="item in this.parentItem.children">
      <side-menu-item v-if="item.children && item.children.length > 0" :parent-item="item" :key="item.id+'_parent'"/>
      <el-menu-item v-else :index="item.path" :key="item.id">
        <el-icon>
          <component v-bind:is="'el-icon-'+item.iconType"></component>
        </el-icon>
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
