<template>
  <div class="custom-bread-crumb">
    <el-breadcrumb :style="{fontSize: `${fontSize}px`}">
      <transition-group name="breadcrumb">
        <el-breadcrumb-item v-for="(item, index) in list" :key="`bread-crumb-${index}`">
          <el-icon style="margin-right: 4px;margin-top: 2px;">
            <component v-bind:is="'el-icon-'+item.iconType"></component>
          </el-icon>
          <span>{{ item.name }}</span>
        </el-breadcrumb-item>
      </transition-group>
    </el-breadcrumb>
  </div>
</template>
<script>
import {findFullMenuByPath} from '@/libs/tools'
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
  data() {
    return {
      homePath: this.$store.state.app.appInfo.homePath
    }
  },
  computed: {
    list() {
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
        iconType: 'home-filled'
      }, ...breadCrumbList]
    }
  }
}
</script>
