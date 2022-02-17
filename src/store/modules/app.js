import {createI18n} from 'vue-i18n'
import Cookies from 'js-cookie'
import langInfo from '@/lang'
import appInfo from '@/store/config/appInfo'

let langList = []
for (let key of Object.keys(langInfo.messages)) {
  langList.push({
    value: key,
    label: langInfo.messages[key].langName
  })
}
let lang = Cookies.get('lang')
if (!lang || !langInfo.langArrays.includes(lang)) {
  lang = langInfo.defaultLang
}
let cookieProperties = {
  path: appInfo.routeBase,
  expires: appInfo.cookieExpires
}
Cookies.set('lang', lang, cookieProperties)
export default {
  state: {
    mainHeight: 0,
    appInfo: appInfo,
    cacheList: [],
    tagNavList: Cookies.get('tagNavList') ? JSON.parse(Cookies.get('tagNavList')) : [],
    isMini: false,
    i18n: createI18n({
      globalInjection: true,
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
      remember: Cookies.get('remember') === 'true',
      token: Cookies.get('token'),
      tokenType: Cookies.get('token_type'),
      scope: Cookies.get('scope'),
      menuList: []
    }
  },
  mutations: {
    MAIN_HEIGHT: (state, payload) => {
      state.mainHeight = payload
    },
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
      Cookies.set('tagNavList', JSON.stringify(payload), cookieProperties)
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
      state.i18n.global.locale = payload
    },
    SET_LOGIN_NO: (state, payload) => {
      state.user.loginNo = payload
      Cookies.set('loginNo', payload, cookieProperties)
    },
    SET_REMEMBER: (state, payload) => {
      state.user.remember = payload
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
      Cookies.remove('token', cookieProperties)
      Cookies.remove('token_type', cookieProperties)
      Cookies.remove('scope', cookieProperties)
    },
    SET_MENU_LIST: (state, payload) => {
      state.user.menuList = payload
    },
    SET_USER_INFO: (state, payload) => {
      state.user.userInfo = payload
    }
  }
}
