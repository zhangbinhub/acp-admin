<template>
  <Submenu :name="`${this.parentItem.id}`">
    <template slot="title">
      <Icon :type="this.parentItem.icon_type"></Icon>
      <span>{{ this.parentItem.name }}</span>
    </template>
    <template v-for="item in this.parentItem.children">
      <side-menu-item v-if="item.children && item.children.length > 0" :key="`menu-${item.id}`"
                      :parent-item="item"></side-menu-item>
      <menu-item v-else :name="item.path" :key="`menu-${item.id}`">
        <Icon :type="item.icon_type"></Icon>
        <span>{{ item.name }}</span>
      </menu-item>
    </template>
  </Submenu>
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
