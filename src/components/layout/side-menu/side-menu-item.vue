<template>
  <el-sub-menu :index="`${this.parentItem.id}`">
    <template #title>
      <el-icon>
        <component v-bind:is="'el-icon-'+this.parentItem.iconType"></component>
      </el-icon>
      <span>{{ this.parentItem.name }}</span>
    </template>
    <template v-for="item in this.parentItem.children">
      <side-menu-item v-if="item.children && item.children.length > 0" :key="item.id+'_parent'" :parent-item="item"/>
      <el-menu-item v-else :key="item.id" :index="item.path">
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
