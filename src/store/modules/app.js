import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import langInfo from '@/lang'
import appInfo from '../config/appInfo'

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
let remember = false
if (Cookies.get('remember') === 'true') {
  remember = true
}
let cookieProperties = {
  expires: appInfo.cookieExpires
}
console.log(typeof cookieProperties.expires)
Cookies.set('lang', lang, cookieProperties)
export default {
  state: {
    appInfo: appInfo,
    cacheList: [],
    tagNavList: [],
    isMini: false,
    i18n: new VueI18n({
      locale: lang,
      messages: langInfo.messages
    }),
    sidebar: {
      opened: Cookies.get('sidebarStatus') !== '0'
    },
    lang: {
      langList: langList,
      langMessages: langInfo.messages,
      lang: lang
    },
    user: {
      userInfo: {},
      loginNo: Cookies.get('loginNo'),
      remember: remember,
      token: Cookies.get('token'),
      tokenType: Cookies.get('token_type'),
      scope: Cookies.get('scope'),
      menuList: []
    }
  },
  mutations: {
    CLOSE_SLIDEBAR: state => {
      Cookies.set('sidebarStatus', 0, cookieProperties)
      state.sidebar.opened = false
    },
    OPEN_SLIDEBAR: state => {
      Cookies.set('sidebarStatus', 1, cookieProperties)
      state.sidebar.opened = true
    },
    SET_CACHE_LIST: (state, payload) => {
      state.cacheList = payload
    },
    SET_TAG_NAV_LIST: (state, payload) => {
      state.tagNavList = payload
    },
    SET_MINI: (state, payload) => {
      state.isMini = payload
    },
    /**
     * 设置语言
     */
    SET_LANG: (state, payload) => {
      state.lang.lang = payload
      Cookies.set('lang', payload, cookieProperties)
      state.i18n.locale = payload
    },
    SET_LOGIN_NO: (state, payload) => {
      state.user.loginNo = payload
      Cookies.set('loginNo', payload, cookieProperties)
    },
    SET_REMEMBER: (state, payload) => {
      state.user.remember = payload === 'true'
      Cookies.set('remember', payload, cookieProperties)
    },
    SET_TOKEN: (state, payload) => {
      state.user.token = payload
      Cookies.set('token', payload, cookieProperties)
    },
    SET_TOKEN_TYPE: (state, payload) => {
      state.user.tokenType = payload
      Cookies.set('token_type', payload, cookieProperties)
    },
    SET_SCOPE: (state, payload) => {
      state.user.scope = payload
      Cookies.set('scope', payload, cookieProperties)
    },
    LOGIN_OUT: state => {
      state.user.token = ''
      state.user.tokenType = ''
      state.user.scope = ''
      state.user.menuList = []
      state.user.userInfo = {}
      Cookies.remove('token')
      Cookies.remove('token_type')
      Cookies.remove('scope')
    },
    SET_MENU_LIST: (state, payload) => {
      state.user.menuList = payload
    },
    SET_USER_INFO: (state, payload) => {
      state.user.userInfo = payload
    }
  }
}
