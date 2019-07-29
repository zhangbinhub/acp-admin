<template>
  <div class="log-file-button">
    <Tooltip :content="$t('pageTitle.routeConfig')" placement="bottom">
      <Button type="text" @click="openRouteConfigPage">
        <Icon :size="20" type="md-code-working"/>
      </Button>
    </Tooltip>
  </div>
</template>

<script>
    export default {
        name: 'routeConfigButton',
        methods: {
            openRouteConfigPage () {
                this.$api.gotoRouteConfig()
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
