import 'babel-polyfill'

import Vue from 'vue'
import App from './App.vue'
import store from './store'
import 'iview/dist/styles/iview.css'
import iView from 'iview'
import router from './router'
import './plugins/plugin-axios.js'
import api from './api'
import './assets/styles/layout/layout.less'
import eCharts from 'echarts'
import './mock'

// 响应式布局
const autoWidth = () => {
  const winWidth = document.documentElement.clientWidth
  if (winWidth <= store.state.app.appInfo.minWidth) {
    store.commit('CLOSE_SLIDEBAR')
    store.commit('SET_MINI', true)
  } else {
    store.commit('OPEN_SLIDEBAR')
    store.commit('SET_MINI', false)
  }
}

Vue.config.productionTip = false

autoWidth()
window.onresize = function () {
  autoWidth()
}

// 加载 eCharts
Vue.prototype.$echarts = eCharts

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
  Modal: Vue.prototype.$Modal,
  notice: Vue.prototype.$Notice,
  i18n: i18n,
  http: Vue.prototype.$http,
  store: store,
  router: router,
  loading: Vue.prototype.$Loading,
  spin: Vue.prototype.$Spin
})
new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
