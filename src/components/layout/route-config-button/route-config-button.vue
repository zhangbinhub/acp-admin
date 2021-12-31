<template>
  <div class="header-bar-button">
    <el-tooltip v-if="!isMobile" :content="$t('pageTitle.routeConfig')" placement="bottom">
      <el-button type="text" @click="openRouteConfigPage">
        <el-icon size="20">
          <el-icon-share/>
        </el-icon>
      </el-button>
    </el-tooltip>
    <el-button v-else type="text" @click="openRouteConfigPage">
      <el-icon size="20">
        <el-icon-share/>
      </el-icon>
    </el-button>
  </div>
</template>

<script>
export default {
  name: 'routeConfigButton',
  props: {
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    openRouteConfigPage() {
      this.$api.gotoRouteConfig()
    }
  }
}
</script>
