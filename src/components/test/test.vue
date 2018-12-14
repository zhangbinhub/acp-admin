<template>
  <div id="test">
    <img :src="require('@/assets/images/logo/logo.png')" alt="Vue logo"/>
    <div>
      <p>{{$t('langName')}}</p>
      <p>
        If iView is successfully added to this project, you'll see an
        <code v-text="'<Button>'"></code>
        below
      </p>
      <i-button type="primary" @click="clickFun">这是一个按钮</i-button>
      <label>
        <i-select v-model="model1" style="width:100px" :label-in-value="true" @on-change="changeFun">
          <Option v-for="item in langList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </i-select>
      </label>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'test',
    data () {
      return {
        langList: this.$store.state.app.langList,
        model1: this.$store.state.app.lang
      }
    },
    methods: {
      clickFun: function () {
        this.$Modal.info({
          title: '消息',
          content: '这是一个对话框'
        })
      },
      changeFun: function (option) {
        this.$store.commit('SET_LANG', option.value)
      }
    }
  }
</script>

<style>
  #test {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
</style>
