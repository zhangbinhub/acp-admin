import zhLocale from 'iview/src/locale/lang/zh-CN'

const messages = Object.assign(zhLocale, {
  langName: '简体中文',
  messages: {
    loginSuccess: '登录成功',
    loginFailed: '登录失败',
    loginInvalid: '用户名或密码错误',
    requestFailed: '请求失败'
  },
  loginForm: {
    username: '用户名',
    usernamePlaceholder: '请输入用户名',
    usernameValidate: '用户名不能为空',
    password: '密码',
    passwordPlaceholder: '请输入密码',
    passwordValidate: '密码不能为空',
    rememberMe: '记住我',
    buttons: {
      login: '登录'
    }
  }
})

export default messages
