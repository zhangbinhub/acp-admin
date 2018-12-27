import zhLocale from 'iview/src/locale/lang/zh-CN'

const messages = Object.assign(zhLocale, {
  lang: '语言',
  langName: '简体中文',
  messages: {
    loginSuccess: '登录成功',
    loginFailed: '登录失败',
    loginInvalid: '用户名或密码错误',
    logoutConfirm: '确认退出当前系统吗？',
    requestFailed: '请求失败'
  },
  pageTitle: {
    test: '测试',
    E404: '404',
    E500: '500',
    login: '登录',
    home: '首页',
    personalInformation: '个人信息维护'
  },
  common: {
    exit: '退出'
  },
  dialog: {
    confirm: '请确认'
  },
  home: {
    fullScreen: '全屏',
    exitFullScreen: '退出全屏',
    personalInformation: '个人信息',
    logout: '退出登录'
  },
  loginForm: {
    usernamePlaceholder: '请输入用户名',
    usernameValidate: '用户名不能为空',
    passwordPlaceholder: '请输入密码',
    passwordValidate: '密码不能为空',
    rememberMe: '记住我',
    buttons: {
      login: '登录'
    }
  },
  errorPage: {
    message404: '页面找不到',
    description404: '众里寻他千百度 蓦然回首 那人却在灯火阑珊处',
    message500: '服务器出错了',
    buttons: {
      back: '返回',
      home: '主页'
    }
  }
})

export default messages
