import twLocale from 'iview/src/locale/lang/zh-TW'

const messages = Object.assign(twLocale, {
  lang: '語言',
  langName: '繁體中文',
  messages: {
    loginSuccess: '登錄成功',
    loginFailed: '登錄失敗',
    loginInvalid: '用戶名或密碼錯誤',
    logoutConfirm: '確認退出當前系統嗎？',
    requestFailed: '請求失敗',
    failed403: '請求被拒絕，可能沒有權限，請聯繫系統管理員',
    leavePage: '輸入的數據將會丟失，確認關閉嗎？',
    allPages: '所有頁面',
    otherPages: '其他頁面',
    saveSuccess: '保存成功'
  },
  pageTitle: {
    test: '測試',
    E404: '404',
    E500: '500',
    login: '登錄',
    home: '首頁',
    personalInformation: '個人信息維護'
  },
  common: {
    exit: '退出'
  },
  dialog: {
    confirm: '請確認'
  },
  home: {
    fullScreen: '全屏',
    exitFullScreen: '退出全屏',
    personalInformation: '個人信息',
    logout: '退出登錄',
    closeAll: '關閉所有',
    closeOther: '關閉其他'
  },
  errorPage: {
    message404: '頁面找不到',
    description404: '衆裏尋他千百度 驀然回首 那人卻在燈火闌珊處',
    message500: '服務器出錯了',
    buttons: {
      back: '返回',
      home: '主頁'
    }
  },
  forms: {
    pleaseEnter: '請輸入',
    loginNo: '登錄帳號',
    password: '密碼',
    rememberMe: '記住我',
    avatar: '頭像',
    avatarUpload: '頭像上傳',
    name: '名稱',
    mobile: '手機號',
    invalid: '無效',
    notEmpty: '不能爲空',
    width: '寬',
    height: '高',
    buttons: {
      login: '登錄',
      submit: '提交',
      reset: '重置',
      upload: '上傳',
      free: '自定義'
    }
  }
})

export default messages
