<template>
  <div class="header-bar-button">
    <el-tooltip :content="$t('pageTitle.home')" placement="bottom">
      <el-button type="text" @click="openHomePage">
        <el-icon size="20">
          <el-icon-home-filled/>
        </el-icon>
      </el-button>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'homeButton',
  methods: {
    openHomePage() {
      this.$api.redirectHome()
    }
  }
}
</script>
