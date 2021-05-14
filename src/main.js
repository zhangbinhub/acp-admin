import * as Vue from 'vue'
import App from '@/App.vue'
import store from '@/store'
import ElementUI from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import router from '@/router'
import VueAxios from 'vue-axios'
import axiosInstance from "@/plugins/plugin-axios"
import api from '@/api'
import '@/assets/styles/layout.less'
import '@/assets/styles/transition.less'
import * as echarts from 'echarts'
import '@/mock'

Nprogress.configure({showSpinner: false})

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
autoWidth()
autoHeight()
window.onresize = function () {
  autoWidth()
  autoHeight()
}
const app = Vue.createApp(App)

// 加载 router
app.use(router)

// 加载 store
app.use(store)

// 加载 ElementUI ，并启用 i18n
const i18n = store.state.app.i18n
app.use(i18n)
app.use(ElementUI, {
  i18n: function (path, options) {
    let value = i18n.global.t(path, options)
    if (value !== null && value !== undefined) return value
    return ''
  }
})

// 加载 axios
app.use(VueAxios, axiosInstance)

// 加载 api
app.use(api, {
  confirm: app.config.globalProperties.$confirm,
  notify: app.config.globalProperties.$notify,
  i18n: i18n,
  http: app.config.globalProperties.$http,
  store: store,
  router: router,
  loading: Nprogress
})

// 加载 eCharts
app.config.globalProperties.$echarts = echarts

app.mount('#app')
