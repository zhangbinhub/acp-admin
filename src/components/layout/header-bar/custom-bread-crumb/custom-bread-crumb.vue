<template>
  <div class="custom-bread-crumb">
    <Breadcrumb :style="{fontSize: `${fontSize}px`}">
      <BreadcrumbItem v-for="(item, index) in list" :key="`bread-crumb-${index}`"
                      :to="index !== list.length - 1 ? item.path : ''">
        <Icon style="margin-right: 4px;" :type="item.iconType"></Icon>
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
    data () {
      return {
        homePath: this.$store.state.app.appInfo.homePath
      }
    },
    computed: {
      list () {
        const breadCrumbList = findFullMenuByPath(this.fullPath, this.menuList)
        if (breadCrumbList.length === 0 && this.fullPath !== this.homePath) {
          breadCrumbList.push({
            name: this.$route.meta.title ? this.$i18n.t(this.$route.meta.title) : this.$route.name,
            path: this.fullPath,
            iconType: this.$route.meta.icon
          })
        }
        return [{
          name: this.$i18n.t('pageTitle.home'),
          path: this.homePath,
          iconType: 'ios-home'
        }, ...breadCrumbList]
      }
    }
  }
</script>
