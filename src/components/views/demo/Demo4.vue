<template>
  <el-card>
    <!--    <iframe src='http://www.baidu.com' style="min-height:800px; width: 100%;border: 0"></iframe>-->
    <p>name:</p>
    <p>{{this.$route.query.name}}</p>
  </el-card>
</template>
<script>
  export default {
    name: 'demo4'
  }
</script>
