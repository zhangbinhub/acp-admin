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
let lock = Cookies.get('lock')
if (!lock) {
  lock = '0' // 默认不锁
}
let lockPage = Cookies.get('lockPage')
if (!lockPage) {
  lockPage = '/' // 锁屏前的页面
}
let remember = false
if (Cookies.get('remember') === 'true') {
  remember = true
}
Cookies.set('lang', lang)
export default {
  state: {
    appInfo: {
      appName: 'Acp-Admin',
      appVersion: '1.0.0',
      copyright: 'Copyright © 2018 by ZhangBin'
    },
    i18n: new VueI18n({
      locale: lang,
      messages: langInfo.messages
    }),
    sidebar: {
      opened: !+Cookies.get('sidebarStatus'),
      minOpen: false // 小屏时菜单状态
    },
    lang: {
      langList: langList,
      langMessages: langInfo.messages,
      lang: lang
    },
    request: {
      client_id: 'a993e842-0338-11e9-a67b-d8c49792dd7b',
      client_secret: 'E0D3024D-9A22-41EE-AC0F-FC6B56E367AE'
    },
    userInfo: {
      username: Cookies.get('username'),
      remember: remember,
      token: Cookies.get('token'),
      tokenType: Cookies.get('token_type'),
      scope: Cookies.get('scope'),
      lock: lock,
      lockPage: lockPage
    }
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
      state.lang.lang = payload
      Cookies.set('lang', payload)
      state.i18n.locale = payload
    },
    SET_USERNAME: (state, payload) => {
      state.userInfo.username = payload
      Cookies.set('username', payload)
    },
    SET_REMEMBER: (state, payload) => {
      state.userInfo.remember = payload === 'true'
      Cookies.set('remember', payload)
    },
    SET_TOKEN: (state, payload) => {
      state.userInfo.token = payload
      Cookies.set('token', payload)
    },
    SET_TOKEN_TYPE: (state, payload) => {
      state.userInfo.tokenType = payload
      Cookies.set('token_type', payload)
    },
    SET_SCOPE: (state, payload) => {
      state.userInfo.scope = payload
      Cookies.set('scope', payload)
    },
    SET_LOCK: (state, payload) => {
      state.userInfo.lock = payload
      Cookies.set('lock', payload)
    },
    SET_LOCK_PAGE: (state, payload) => {
      state.userInfo.lockPage = payload
      Cookies.set('lockPage', payload)
    },
    LOGIN_OUT: state => {
      state.userInfo.token = ''
      state.userInfo.tokenType = ''
      state.userInfo.scope = ''
      state.userInfo.lock = '0'
      state.userInfo.lockPage = '/'
      Cookies.remove('token')
      Cookies.remove('token_type')
      Cookies.remove('scope')
      Cookies.remove('lock')
      Cookies.remove('lockPage')
    }
  },
  actions: {
    ToggleSideBar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR')
    }
  }
}
