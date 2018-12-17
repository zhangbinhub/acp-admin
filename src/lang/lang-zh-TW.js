import twLocale from 'iview/src/locale/lang/zh-TW'

const messages = Object.assign(twLocale, {
  langName: '繁體中文',
  messages: {
    loginSuccess: '登錄成功',
    loginFailed: '登錄失敗',
    loginInvalid: '用戶名或密碼錯誤',
    requestFailed: '請求失敗'
  },
  loginForm: {
    username: '用戶名',
    usernamePlaceholder: '請輸入用戶名',
    usernameValidate: '用戶名不能爲空',
    password: '密碼',
    passwordPlaceholder: '請輸入密碼',
    passwordValidate: '密碼不能爲空',
    rememberMe: '記住我',
    buttons: {
      login: '登錄'
    }
  }
})

export default messages
