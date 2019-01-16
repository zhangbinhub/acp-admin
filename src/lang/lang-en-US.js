import enLocale from 'iview/src/locale/lang/en-US'

const messages = Object.assign(enLocale, {
  lang: 'Lang',
  langName: 'English',
  messages: {
    loginSuccess: 'Login successfully',
    loginFailed: 'Login failed',
    loginInvalid: 'loginNo and password do not match',
    logoutConfirm: 'Confirm to logout current system ?',
    requestFailed: 'Requesst failed',
    failed403: 'Request rejected, may not hava permission, please contact the system administrator',
    leavePage: 'The data entered will be lost. Are you sure to close?',
    allPages: 'All Pages',
    otherPages: 'Other Pages',
    saveSuccess: 'Save Successfully',
    updateSuccess: 'Update Successfully',
    deleteSuccess: 'Delete Successfully',
    changedPassword: 'You have changed your password. Please log in again.',
    tableNoData: 'No data found',
    tableDataCannotDel: 'This data cannot be deleted',
    selectDataForDelete: 'Please select the data you want to delete',
    deleteDataConfirm: 'Are you sure to delete the selected data?'
  },
  pageTitle: {
    test: 'test',
    E404: '404',
    E500: '500',
    login: 'login',
    home: 'home',
    personalInformation: 'Personal Information Configure',
    appConfig: 'Application Configure',
    authConfig: 'Authority Configure',
    orgConfig: 'Organization Configure',
    runtimeConfig: 'Parameter Configure',
    roleConfig: 'Role Configure',
    userConfig: 'User Configure'
  },
  common: {
    exit: 'Exit'
  },
  dialog: {
    info: 'Message',
    error: 'Error message',
    warning: 'Warning message',
    success: 'Success',
    confirm: 'Please confirm'
  },
  home: {
    fullScreen: 'FullScreen',
    exitFullScreen: 'Exit FullScreen',
    personalInformation: 'Personal Information',
    logout: 'logout',
    closeAll: 'Close All',
    closeOther: 'Close Other'
  },
  errorPage: {
    message404: 'Page not found',
    description404: '',
    message500: 'Internal Server Error',
    buttons: {
      back: 'back',
      home: 'home'
    }
  },
  forms: {
    changePassword: 'Change Password',
    pleaseEnter: 'Please enter ',
    loginNo: 'loginNo',
    password: 'password',
    rememberMe: 'remember me',
    avatar: 'avatar',
    avatarUpload: 'Avatar Upload',
    name: 'name',
    value: 'value',
    mobile: 'mobile',
    describe: 'describe',
    info: 'info',
    action: 'action',
    invalid: ' is invalid',
    enabled: 'enabled',
    disabled: 'disabled',
    notEmpty: ' can not be empty',
    incorrect: ' is incorrect',
    width: 'Width',
    height: 'Height',
    old: 'Old ',
    new: 'New ',
    confirmPassword: 'Confirm password',
    passwordNotEqual: 'Confirm password is not equal new password',
    seconds: 'seconds',
    buttons: {
      login: 'login',
      submit: 'submit',
      search: 'search',
      edit: 'edit',
      update: 'update',
      save: 'save',
      delete: 'delete',
      cancel: 'cancel',
      add: 'add',
      reset: 'reset',
      upload: 'upload',
      view: 'view',
      free: 'Free',
      updateSecret: 'update secret'
    }
  }
})

export default messages
