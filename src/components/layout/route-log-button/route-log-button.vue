<template>
  <div class="header-bar-button">
    <el-tooltip :content="$t('pageTitle.routeLog')" placement="bottom">
      <el-button type="text" @click="openRouteLogPage">
        <el-icon size="20">
          <el-icon-reading/>
        </el-icon>
      </el-button>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'routeLogButton',
  methods: {
    openRouteLogPage() {
      this.$api.gotoRouteLog()
    }
  }
}
</script>
