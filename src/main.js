import Vue from 'vue'
import App from './App.vue'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import router from './router'
import './plugins/plugin-axios.js'
import api from './api'
import './assets/styles/layout.less'
import './assets/styles/transition.less'
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
const autoHeight = () => {
  const winHeight = document.documentElement.clientHeight
  store.commit('MAIN_HEIGHT', winHeight - 120)
}

Vue.config.productionTip = false

autoWidth()
autoHeight()
window.onresize = function () {
  autoWidth()
  autoHeight()
}

// 加载 eCharts
Vue.prototype.$echarts = eCharts
// 加载 ElementUI ，并启用 i18n
const i18n = store.state.app.i18n
Vue.use(ElementUI, {
  i18n: function (path, options) {
    let value = i18n.t(path, options)
    if (value !== null && value !== undefined) return value
    return ''
  }
})
Vue.use(api, {
  confirm: Vue.prototype.$confirm,
  notify: Vue.prototype.$notify,
  i18n: i18n,
  http: Vue.prototype.$http,
  store: store,
  router: router,
  loading: NProgress
})
new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
