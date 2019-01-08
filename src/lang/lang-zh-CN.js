import zhLocale from 'iview/src/locale/lang/zh-CN'

const messages = Object.assign(zhLocale, {
  lang: '语言',
  langName: '简体中文',
  messages: {
    loginSuccess: '登录成功',
    loginFailed: '登录失败',
    loginInvalid: '用户名或密码错误',
    logoutConfirm: '确认退出当前系统吗？',
    requestFailed: '请求失败',
    failed403: '请求被拒绝，可能没有权限，请联系系统管理员',
    leavePage: '输入的数据将会丢失，确认关闭吗？',
    allPages: '所有页面',
    otherPages: '其他页面',
    saveSuccess: '保存成功',
    changedPassword: '您修改了密码，请重新登录'
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
    info: '提示信息',
    confirm: '请确认'
  },
  home: {
    fullScreen: '全屏',
    exitFullScreen: '退出全屏',
    personalInformation: '个人信息',
    logout: '退出登录',
    closeAll: '关闭所有',
    closeOther: '关闭其他'
  },
  errorPage: {
    message404: '页面找不到',
    description404: '众里寻他千百度 蓦然回首 那人却在灯火阑珊处',
    message500: '服务器出错了',
    buttons: {
      back: '返回',
      home: '主页'
    }
  },
  forms: {
    changePassword: '修改密码',
    pleaseEnter: '请输入',
    loginNo: '登录账号',
    password: '密码',
    rememberMe: '记住我',
    avatar: '头像',
    avatarUpload: '头像上传',
    name: '名称',
    mobile: '手机号',
    invalid: '无效',
    notEmpty: '不能为空',
    width: '宽',
    height: '高',
    old: '旧',
    new: '新',
    confirmPassword: '确认密码',
    passwordNotEqual: '两次输入的密码不相等',
    buttons: {
      login: '登录',
      submit: '提交',
      reset: '重置',
      upload: '上传',
      free: '自定义'
    }
  }
})

export default messages
