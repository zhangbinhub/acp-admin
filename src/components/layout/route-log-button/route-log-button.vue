<template>
  <div class="header-bar-button">
    <el-tooltip v-if="!isMobile" :content="$t('pageTitle.routeLog')" placement="bottom">
      <el-button type="text" @click="openRouteLogPage">
        <el-icon size="20">
          <el-icon-reading/>
        </el-icon>
      </el-button>
    </el-tooltip>
    <el-button v-else type="text" @click="openRouteLogPage">
      <el-icon size="20">
        <el-icon-reading/>
      </el-icon>
    </el-button>
  </div>
</template>

<script>
export default {
  name: 'routeLogButton',
  props: {
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    openRouteLogPage() {
      this.$api.gotoRouteLog()
    }
  }
}
</script>
