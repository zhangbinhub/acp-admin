<template>
  <div class="header-bar-button">
    <el-tooltip :content="$t('pageTitle.deploy')" placement="bottom">
      <el-button type="text" @click="openDeployPage">
        <i style="font-size: 20px" class="el-icon-s-tools"/>
      </el-button>
    </el-tooltip>
  </div>
</template>

<script>
  export default {
    name: 'deployButton',
    methods: {
      openDeployPage () {
        this.$api.gotoDeploy()
      }
    }
  }
</script>
