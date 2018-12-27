<template>
  <div class="custom-bread-crumb">
    <Breadcrumb :style="{fontSize: `${fontSize}px`}">
      <BreadcrumbItem v-for="item in list" :to="item.path" :key="`bread-crumb-${item.path}`">
        <Icon style="margin-right: 4px;" :type="item.icon_type"></Icon>
        {{ item.name }}
      </BreadcrumbItem>
    </Breadcrumb>
  </div>
</template>
<script>
  import './custom-bread-crumb.less'

  export default {
    name: 'customBreadCrumb',
    props: {
      menuList: {
        type: Array,
        default: () => []
      },
      fullPath: String,
      fontSize: {
        type: Number,
        default: 14
      }
    },
    computed: {
      list () {
        return []
      }
    }
  }
</script>
