<template>
  <div class="header-bar-button">
    <el-tooltip :content="$t('pageTitle.logFile')" placement="bottom">
      <el-button type="text" @click="openLogFilePage">
        <el-icon size="20">
          <el-icon-document/>
        </el-icon>
      </el-button>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'logFileButton',
  methods: {
    openLogFilePage() {
      this.$api.gotoLogFile()
    }
  }
}
</script>
