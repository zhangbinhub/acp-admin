import enLocale from 'iview/src/locale/lang/en-US'

const messages = Object.assign(enLocale, {
  langName: 'English',
  messages: {
    loginSuccess: 'Login successfully',
    loginFailed: 'username and password do not match'
  },
  loginForm: {
    username: 'username',
    usernamePlaceholder: 'Please enter your username',
    usernameValidate: 'Username cannot be empty',
    password: 'password',
    passwordPlaceholder: 'Please enter your password',
    passwordValidate: 'Password cannot be empty',
    rememberMe: 'Remember me',
    buttons: {
      login: 'login'
    }
  }
})

export default messages
