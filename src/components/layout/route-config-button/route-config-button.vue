<template>
  <div class="header-bar-button">
    <el-tooltip :content="$t('pageTitle.routeConfig')" placement="bottom">
      <el-button type="text" @click="openRouteConfigPage">
        <el-icon size="20">
          <el-icon-share/>
        </el-icon>
      </el-button>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'routeConfigButton',
  methods: {
    openRouteConfigPage() {
      this.$api.gotoRouteConfig()
    }
  }
}
</script>
