import twLocale from 'element-ui/lib/locale/lang/zh-TW'

const messages = Object.assign(twLocale, {
  lang: '語言',
  langName: '繁體中文',
  messages: {
    loginSuccess: '登錄成功',
    loginFailed: '登錄失敗',
    loginInvalid: '用戶名或密碼錯誤',
    logoutConfirm: '確認退出當前系統嗎？',
    requestFailed: '請求失敗',
    validateFailed: '校驗失败',
    failed403: '請求被拒絕，可能沒有權限，請聯繫系統管理員',
    failed404: '找不到資源',
    leavePage: '輸入的數據將會丟失，確認關閉嗎？',
    allPages: '所有頁面',
    otherPages: '其他頁面',
    requestSuccess: '請求成功',
    createSuccess: '創建成功',
    saveSuccess: '保存成功',
    updateSuccess: '更新成功',
    deleteSuccess: '删除成功',
    changedPassword: '您修改了密碼，請重新登錄',
    tableNoData: '沒有查詢到數據',
    tableDataCannotDel: '該條數據不允許刪除',
    selectDataForDelete: '請選擇需要刪除的數據',
    deleteDataConfirm: '確定刪除所選數據嗎？',
    modifyLoginNo: '修改登陸賬號將重置密碼，是否繼續？',
    resetPassword: '確定重置所選用戶密碼嗎？',
    refreshServiceConfirm: '確定刷新服務配置信息嗎？指定的服務將重新從配置中心獲取配置信息',
    refreshRouteConfirm: '確定刷新網關路由信息嗎？',
    deployWorkFlowConfirm: '確定部署流程定義嗎？'
  },
  pageTitle: {
    test: '測試',
    E404: '404',
    E500: '500',
    login: '登錄',
    home: '首頁',
    personalInformation: '個人信息維護',
    routeConfig: '路由配置',
    routeLog: '路由日誌',
    logFile: '日誌文件',
    operateLog: '操作日誌',
    loginLog: '登錄日誌',
    appConfig: '應用配置',
    authConfig: '權限配置',
    orgConfig: '機構配置',
    runtimeConfig: '運行參數配置',
    roleConfig: '角色配置',
    userConfig: '用戶配置',
    workflowDeploy: '工作流部署'
  },
  common: {
    exit: '退出'
  },
  dialog: {
    info: '提示信息',
    error: '錯誤信息',
    warning: '警告信息',
    success: '操作成功',
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
    loginStatistics: '登錄統計',
    numberOfOnlineUsers: '在線用戶數',
    changePassword: '修改密碼',
    pleaseEnter: '請輸入',
    loginNo: '登錄帳號',
    password: '密碼',
    rememberMe: '記住我',
    avatar: '頭像',
    avatarUpload: '頭像上傳',
    name: '名稱',
    profile: '配置項',
    label: '標籤',
    key: '鍵',
    code: '編碼',
    sort: '序號',
    level: '級別',
    parent: '上級',
    userList: '用戶列表',
    roleList: '角色列表',
    selected: '已選',
    optional: '可選項',
    value: '值',
    mobile: '手機號',
    describe: '描述',
    remarks: '備註',
    info: '信息',
    action: '操作',
    invalid: '無效',
    enabled: '啓用',
    disabled: '禁用',
    notEmpty: '不能爲空',
    incorrect: '不正確',
    width: '寬',
    height: '高',
    old: '舊',
    new: '新',
    confirmPassword: '確認密碼',
    passwordNotEqual: '兩次輸入的密碼不相等',
    scope: '權限範圍',
    accessTokenValiditySeconds: 'token有效期',
    refreshTokenValiditySeconds: 'refreshToken有效期',
    seconds: '秒',
    millisecond: '毫秒',
    organization: '機構',
    role: '角色',
    menu: '菜單',
    clientName: '客戶端名稱',
    user: '用戶',
    moduleFunc: '模塊功能',
    basicInfo: '基本信息',
    menuList: '菜單列表',
    orgList: '機構列表',
    orgMngList: '可管理的機構',
    moduleFuncList: '模塊功能列表',
    iconType: '圖標',
    path: '路徑',
    openType: '打開方式',
    inner: '內嵌模式',
    newTabs: '新標籤頁',
    status: '狀態',
    startDate: '開始日期',
    endDate: '結束日期',
    startDateCantGreaterThenEndDate: '開始日期不能大於結束日期',
    routeId: '路由ID',
    uri: 'uri',
    predicates: '斷言',
    filters: '過濾器',
    remoteIp: '客戶端IP',
    gatewayIp: '網關IP',
    serverId: '服務ID',
    targetUri: '目標URL',
    requestTime: '請求時間',
    processTime: '處理時長',
    responseTime: '響應時間',
    responseStatus: '響應狀態碼',
    historyInfo: '歷史信息',
    currentInfo: '當前信息',
    infoType: '信息類型',
    targetIp: '目標服務IP',
    targetPath: '目標服務路徑',
    method: '請求方法',
    token: '請求token',
    clientId: '客戶端ID',
    identify: '標識',
    userName: '用戶名稱',
    configRefreshServer: '服務名',
    configRefreshMatcher: '匹配表達式',
    configRefreshMatcherDescribe: '請在下方輸入服務ID的匹配表達式（模糊匹配可用"**"），服務ID格式如下：',
    configRefreshAll: '所有服務',
    resourceName: '資源名稱',
    content: '內容',
    version: '版本',
    createTime: '創建時間',
    modifyTime: '修改時間',
    deployTime: '部署時間',
    processKey: '流程定義鍵',
    processFile: '流程文件',
    filterKey: '過濾關鍵字',
    area: '區域',
    buttons: {
      login: '登錄',
      submit: '提交',
      search: '查詢',
      edit: '編輯',
      update: '更新',
      save: '保存',
      delete: '刪除',
      cancel: '取消',
      add: '新增',
      reset: '重置',
      upload: '上傳',
      view: '查看',
      image: '圖片',
      free: '自定義',
      updateSecret: '更新密鑰',
      select: '選擇',
      deSelect: '取消選擇',
      refresh: '刷新',
      resetPwd: '重置密碼',
      refreshService: '刷新服務',
      refreshRoute: '刷新路由',
      chooseFile: '選擇文件',
      downLoadFile: '文件下載',
      deploy: '部署'
    }
  }
})

export default messages
