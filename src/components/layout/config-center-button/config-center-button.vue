<template>
  <div class="log-file-button">
    <Tooltip :content="$t('pageTitle.configCenter')" placement="bottom">
      <Button type="text" @click="openConfigCenterPage">
        <Icon :size="20" type="ios-construct"/>
      </Button>
    </Tooltip>
  </div>
</template>

<script>
  export default {
    name: 'configCenterButton',
    methods: {
      openConfigCenterPage () {
        this.$api.gotoConfigCenter()
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
