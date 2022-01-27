import * as Vue from 'vue'
import store from '@/store'
import ElementPlus from 'element-plus'
import * as ElementPlusIcons from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import router from '@/router'
import VueAxios from 'vue-axios'
import axiosInstance from "@/plugins/axios/plugin-axios"
import api from '@/api'
import '@/assets/styles/layout.less'
import '@/assets/styles/transition.less'
import * as echarts from 'echarts'
import App from '@/App.vue'
import {isMobileDevice} from "@/libs/tools";
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
  let mainHeight = document.documentElement.clientHeight
  if (isMobileDevice()) {
    mainHeight = mainHeight - 60 - 59 - 30
  } else {
    mainHeight = mainHeight - 60 - 32 - 30
  }
  store.commit('MAIN_HEIGHT', mainHeight)
}
autoWidth()
autoHeight()
window.onresize = function () {
  autoWidth()
  autoHeight()
}

const transElIconName = (iconName) => {
  return 'el-icon' + iconName.replace(/[A-Z]/g, (match) => '-' + match.toLowerCase())
}

const app = Vue.createApp(App)

// 加载 router
app.use(router)

// 加载 store
app.use(store)

// 加载 i18n
const i18n = store.state.app.i18n
app.use(i18n)

// 加载 ElementPlus、ElementPlusIcons
app.use(ElementPlus)
for (let iconName in ElementPlusIcons) {
  app.component(transElIconName(iconName), ElementPlusIcons[iconName])
}

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
