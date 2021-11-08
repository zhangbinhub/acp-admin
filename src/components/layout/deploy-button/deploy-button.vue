<template>
  <div class="header-bar-button">
    <el-tooltip :content="$t('pageTitle.deploy')" placement="bottom">
      <el-button type="text" @click="openDeployPage">
        <el-icon size="20">
          <el-icon-tools/>
        </el-icon>
      </el-button>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'deployButton',
  methods: {
    openDeployPage() {
      this.$api.gotoDeploy()
    }
  }
}
</script>
