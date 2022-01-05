<template>
  <el-card>
    <div>
      <p>test</p>
      <p>query: {{ $route.query }}</p>
      <p>params: {{ $route.params }}</p>
      <el-button @click="jump">jump</el-button>
    </div>
  </el-card>
</template>
<script>
export default {
  name: 'demo3',
  methods: {
    jump() {
      this.$api.turnToPage({
        name: 'demo3',
        query: {name: 'demo33333'},
        params: {level1: '1', level2: {level3: '3'}}
      })
    }
  }
}
</script>
