<template>
  <div class="header-bar-button">
    <el-tooltip :content="$t('pageTitle.configCenter')" placement="bottom">
      <el-button type="text" @click="openConfigCenterPage">
        <i style="font-size: 20px" class="el-icon-s-operation"></i>
      </el-button>
    </el-tooltip>
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
