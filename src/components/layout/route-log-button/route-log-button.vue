<template>
  <div class="header-bar-button">
    <el-tooltip :content="$t('pageTitle.routeLog')" placement="bottom">
      <el-button type="text" @click="openRouteLogPage">
        <i style="font-size: 20px" class="el-icon-reading"/>
      </el-button>
    </el-tooltip>
  </div>
</template>

<script>
  export default {
    name: 'routeLogButton',
    methods: {
      openRouteLogPage () {
        this.$api.gotoRouteLog()
      }
    }
  }
</script>
