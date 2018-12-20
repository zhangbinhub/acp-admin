import enLocale from 'iview/src/locale/lang/en-US'

const messages = Object.assign(enLocale, {
  langName: 'English',
  messages: {
    loginSuccess: 'Login successfully',
    loginFailed: 'Login failed',
    loginInvalid: 'username and password do not match',
    requestFailed: 'Requesst failed'
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
  },
  errorPage: {
    message404: 'Page not found',
    description404: '',
    message500: 'Internal Server Error',
    buttons: {
      back: 'back',
      home: 'home'
    }
  }
})

export default messages
