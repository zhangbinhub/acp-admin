<template>
  <el-config-provider :locale="localLangMessage">
    <router-view/>
  </el-config-provider>
</template>

<script>
export default {
  name: 'app',
  computed: {
    localLangMessage() {
      return this.$store.state.app.lang.langMessages[this.$store.state.app.lang.lang]
    }
  }
}
</script>
