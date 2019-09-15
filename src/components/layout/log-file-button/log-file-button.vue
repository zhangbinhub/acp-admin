<template>
  <div class="header-bar-button">
    <el-tooltip :content="$t('pageTitle.logFile')" placement="bottom">
      <el-button type="text" @click="openLogFilePage">
        <i style="font-size: 20px" class="el-icon-document"></i>
      </el-button>
    </el-tooltip>
  </div>
</template>

<script>
    export default {
        name: 'logFileButton',
        methods: {
            openLogFilePage () {
                this.$api.gotoLogFile()
            }
        }
    }
</script>
