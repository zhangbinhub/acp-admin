import 'babel-polyfill'

import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import 'iview/dist/styles/iview.css'
import iView from 'iview'
import './plugins/plugin-axios.js'
import api from './api'

import './assets/styles/layout/layout.less'

Vue.config.productionTip = false
// 响应式布局
let winWidth = document.documentElement.clientWidth
if (winWidth <= 600) {
  store.commit('CLOSE_SLIDEBAR')
} else {
  store.commit('OPEN_SLIDEBAR')
}
window.onresize = function () {
  winWidth = document.documentElement.clientWidth
  if (winWidth <= 600) {
    store.commit('CLOSE_SLIDEBAR')
  } else {
    store.commit('OPEN_SLIDEBAR')
  }
}

// 加载 iView ，并启用 i18n
const i18n = store.state.app.i18n
Vue.use(iView, {
  i18n: function (path, options) {
    let value = i18n.t(path, options)
    if (value !== null && value !== undefined) return value
    return ''
  }
})
Vue.use(api, {
  notice: Vue.prototype.$Notice,
  i18n: i18n,
  http: Vue.prototype.$http,
  store: store
})
new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
