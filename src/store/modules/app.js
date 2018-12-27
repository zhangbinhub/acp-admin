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
Cookies.set('lang', lang)
export default {
  state: {
    appInfo: appInfo,
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
    userInfo: {
      customerName: '',
      avatorImg: '',
      userObj: {},
      username: Cookies.get('username'),
      remember: remember,
      token: Cookies.get('token'),
      tokenType: Cookies.get('token_type'),
      scope: Cookies.get('scope'),
      menuList: []
    }
  },
  mutations: {
    CLOSE_SLIDEBAR: state => {
      Cookies.set('sidebarStatus', 0)
      state.sidebar.opened = false
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
    LOGIN_OUT: state => {
      state.userInfo.token = ''
      state.userInfo.tokenType = ''
      state.userInfo.scope = ''
      state.userInfo.menuList = []
      state.userInfo.customerName = ''
      state.userInfo.avatorImg = ''
      state.userInfo.userObj = {}
      Cookies.remove('token')
      Cookies.remove('token_type')
      Cookies.remove('scope')
    },
    SET_MENU_LIST: (state, payload) => {
      state.userInfo.menuList = payload
    },
    SET_CUSTOMER_NAME: (state, payload) => {
      state.userInfo.customerName = payload
    },
    SET_AVATOR_IMG: (state, payload) => {
      state.userInfo.avatorImg = payload
    },
    SET_USER_OBJ: (state, payload) => {
      state.userInfo.userObj = payload
    }
  }
}
