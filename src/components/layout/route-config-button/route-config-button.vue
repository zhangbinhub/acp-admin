<template>
  <div class="header-bar-button">
    <el-tooltip :content="$t('pageTitle.routeConfig')" placement="bottom">
      <el-button type="text" @click="openRouteConfigPage">
        <i style="font-size: 20px" class="el-icon-share"></i>
      </el-button>
    </el-tooltip>
  </div>
</template>

<script>
    export default {
        name: 'routeConfigButton',
        methods: {
            openRouteConfigPage () {
                this.$api.gotoRouteConfig()
            }
        }
    }
</script>
