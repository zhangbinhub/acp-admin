<template>
  <div class="header-bar-button">
    <el-tooltip v-if="!isMobile" :content="$t('pageTitle.deploy')" placement="bottom">
      <el-button type="text" @click="openDeployPage">
        <el-icon size="20">
          <el-icon-tools/>
        </el-icon>
      </el-button>
    </el-tooltip>
    <el-button v-else type="text" @click="openDeployPage">
      <el-icon size="20">
        <el-icon-tools/>
      </el-icon>
    </el-button>
  </div>
</template>

<script>
export default {
  name: 'deployButton',
  props: {
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    openDeployPage() {
      this.$api.gotoDeploy()
    }
  }
}
</script>
