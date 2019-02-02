<template>
  <div class="log-file-button">
    <Tooltip :content="$t('pageTitle.logFile')" placement="bottom">
      <Button type="text" @click="openLogFilePage">
        <Icon :size="20" type="ios-bug"/>
      </Button>
    </Tooltip>
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

<style lang="less">
  .log-file-button {
    margin-right: 12px;

    .ivu-badge-dot {
      top: 20px;
    }

    .ivu-btn.ivu-btn-text {
      padding: 5px 1px 6px;
    }
  }
</style>
