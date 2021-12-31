<template>
  <div class="header-bar-button">
    <el-tooltip v-if="!isMobile" :content="$t('pageTitle.logFile')" placement="bottom">
      <el-button type="text" @click="openLogFilePage">
        <el-icon size="20">
          <el-icon-document/>
        </el-icon>
      </el-button>
    </el-tooltip>
    <el-button v-else type="text" @click="openLogFilePage">
      <el-icon size="20">
        <el-icon-document/>
      </el-icon>
    </el-button>
  </div>
</template>

<script>
export default {
  name: 'logFileButton',
  props: {
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    openLogFilePage() {
      this.$api.gotoLogFile()
    }
  }
}
</script>
