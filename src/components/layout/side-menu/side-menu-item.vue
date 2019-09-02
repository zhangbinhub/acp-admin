<template>
  <el-submenu :index="`${this.parentItem.id}`">
    <template slot="title">
      <i :class="this.parentItem.iconType"></i>
      <span>{{ this.parentItem.name }}</span>
    </template>
    <template v-for="item in this.parentItem.children">
      <side-menu-item v-if="item.children && item.children.length > 0" :parent-item="item"></side-menu-item>
      <el-menu-item v-else :index="item.path">
        <template slot="title">
          <i :class="item.iconType"></i>
          <span>{{item.name}}</span>
        </template>
      </el-menu-item>
    </template>
  </el-submenu>
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
