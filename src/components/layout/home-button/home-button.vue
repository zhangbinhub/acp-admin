<template>
  <div class="header-bar-button">
    <el-tooltip v-if="!isMobile" :content="$t('pageTitle.home')" placement="bottom">
      <el-button type="text" @click="openHomePage">
        <el-icon size="23px">
          <el-icon-home-filled/>
        </el-icon>
      </el-button>
    </el-tooltip>
    <el-button v-else type="text" @click="openHomePage">
      <el-icon size="23px">
        <el-icon-home-filled/>
      </el-icon>
    </el-button>
  </div>
</template>

<script>
export default {
  name: 'homeButton',
  props: {
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    openHomePage() {
      this.$api.redirectHome()
    }
  }
}
</script>
