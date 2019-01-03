<template>
  <div class="custom-bread-crumb">
    <Breadcrumb :style="{fontSize: `${fontSize}px`}">
      <BreadcrumbItem v-for="(item, index) in list" :key="`bread-crumb-${index}`"
                      :to="index !== list.length - 1 ? item.path : ''">
        <Icon style="margin-right: 4px;" :type="item.icon_type"></Icon>
        <span>{{ item.name }}</span>
      </BreadcrumbItem>
    </Breadcrumb>
  </div>
</template>
<script>
  import { findFullMenuByPath } from '@/libs/tools'
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
        const breadCrumbList = findFullMenuByPath(this.fullPath, this.menuList)
        if (breadCrumbList.length === 0 && this.fullPath !== this.$store.state.app.appInfo.homePath) {
          breadCrumbList.push({
            name: this.$route.meta.title ? this.$i18n.t(this.$route.meta.title) : this.$route.name,
            path: this.fullPath,
            icon_type: this.$route.meta.icon
          })
        }
        return [{
          name: this.$i18n.t('pageTitle.home'),
          path: this.$store.state.app.appInfo.homePath,
          icon_type: 'ios-home'
        }, ...breadCrumbList]
      }
    }
  }
</script>
