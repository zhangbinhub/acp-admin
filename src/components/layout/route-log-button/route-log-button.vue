<template>
  <div class="log-file-button">
    <Tooltip :content="$t('pageTitle.routeLog')" placement="bottom">
      <Button type="text" @click="openRouteLogPage">
        <Icon :size="20" type="ios-book"/>
      </Button>
    </Tooltip>
  </div>
</template>

<script>
  export default {
    name: 'routeLogButton',
    methods: {
      openRouteLogPage () {
        this.$api.gotoRouteLog()
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
