import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import langInfo from '@/lang'

// 配置 i18n 国际化
Vue.use(VueI18n)
let langList = []
Object.keys(langInfo.messages).forEach(function (key) {
  langList.push({
    value: key,
    label: langInfo.messages[key].langName
  })
})
let lang = Cookies.get('lang')
if (!lang || !langInfo.langArrays.includes(lang)) {
  lang = langInfo.defaultLang
}
Cookies.set('lang', lang)
export default {
  state: {
    appName: 'Acp-Admin',
    appVersion: '1.0',
    i18n: new VueI18n({
      locale: lang,
      messages: langInfo.messages
    }),
    sidebar: {
      opened: !+Cookies.get('sidebarStatus'),
      minOpen: false // 小屏时菜单状态
    },
    langList: langList,
    langMessages: langInfo.messages,
    lang: lang,
    token: Cookies.get('token'),
    lock: '0', // 默认不锁
    lockPage: '/index' // 锁屏前的页面
  },
  mutations: {
    /**
     * 菜单的缩展
     */
    TOGGLE_SIDEBAR: state => {
      let winWidth = document.documentElement.clientWidth
      if (winWidth <= 600) {
        state.sidebar.minOpen = !state.sidebar.minOpen
        state.sidebar.opened = false
        Cookies.set('sidebarStatus', 0)
      } else {
        if (state.sidebar.opened) {
          Cookies.set('sidebarStatus', 1)
        } else {
          Cookies.set('sidebarStatus', 0)
        }
        state.sidebar.opened = !state.sidebar.opened
      }
    },
    CLOSE_SLIDEBAR: state => {
      Cookies.set('sidebarStatus', 0)
      state.sidebar.opened = false
      state.sidebar.minOpen = false
    },
    OPEN_SLIDEBAR: state => {
      Cookies.set('sidebarStatus', 1)
      state.sidebar.opened = true
    },
    /**
     * 设置语言
     */
    SET_LANG: (state, payload) => {
      state.lang = payload
      Cookies.set('lang', payload)
      state.i18n.locale = payload
    },
    SET_TOKEN: (state, payload) => {
      state.token = payload
      Cookies.set('token', payload)
    },
    SET_LOCK: (state, payload) => {
      state.lock = payload
      Cookies.set('lock', payload)
    },
    SET_LOCK_PAGE: (state, payload) => {
      state.lockPage = payload
      Cookies.set('lockPage', payload)
    }
  },
  actions: {
    ToggleSideBar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR')
    }
  }
}
