import {
  setTagNavListInLocalstorage,
  findMenuByPath
} from '@/libs/tools'

const ApiComm = {
  $Modal: undefined,
  $notice: undefined,
  $i18n: undefined,
  $http: undefined,
  $store: undefined,
  $router: undefined,
  $loading: undefined,
  $Spin: undefined,
  showSpin: false,
  install: function (Vue, options) {
    Vue.prototype.$api = this
    this.$Modal = options.Modal
    this.$notice = options.notice
    this.$i18n = options.i18n
    this.$http = options.http
    this.$store = options.store
    this.$router = options.router
    this.$loading = options.loading
    this.$Spin = options.spin
    this.showSpin = false

    // 请求拦截器
    this.$http.interceptors.request.use(config => {
      this.$loading.start()
      if (this.showSpin) {
        this.$Spin.show()
      }
      if (this.$store.state.app.user.token) {
        config.headers.Authorization = `${this.$store.state.app.user.tokenType} ${this.$store.state.app.user.token}`
      }
      return config
    }, error => {
      this.$Spin.hide()
      this.$loading.error()
      this.errorProcess(error)
      return Promise.reject(error)
    })

    // 响应拦截器
    this.$http.interceptors.response.use(data => {
      this.$Spin.hide()
      this.$loading.finish()
      return data
    }, error => {
      this.$Spin.hide()
      this.$loading.error()
      if (error.response) {
        switch (error.response.status) {
          case 400: // 业务错误
            if (!error.config.headers.Process400 || error.config.headers.Process400 !== 'false') {
              this.errorProcess(error)
            }
            break
          case 401: // token 失效
            if (!error.config.headers.Process401 || error.config.headers.Process401 !== 'false') {
              this.redirectLogin()
              return
            }
            break
          case 403: // 权限不足
            error.response.data.errorDescription = this.$i18n.t('messages.failed403')
            if (!error.config.headers.Process403 || error.config.headers.Process403 !== 'false') {
              this.errorProcess(error)
            }
            break
          case 404: // 页面找不到
            this.redirectE404()
            return
          case 500: // 系统内部异常
            let errorMsg = 'Internal System Error'
            if (error.response.data) {
              if (typeof error.response.data === 'string') {
                errorMsg = String(error.response.data)
              } else {
                if (error.response.data.errorDescription) {
                  errorMsg = error.response.data.errorDescription
                } else {
                  errorMsg = error.response.data.message
                }
              }
            }
            this.redirectE500(errorMsg)
            return
        }
        return Promise.reject(error)
      }
      this.errorProcess(error)
    })
  },
  errorProcess (error, title) {
    let errorMessage = ''
    if (error.response) {
      if (typeof error.response.data === 'string') {
        errorMessage = String(error.response.data)
      } else {
        if (error.response.data.errorDescription) {
          errorMessage = error.response.data.errorDescription
        } else {
          errorMessage = error.response.data.message
        }
      }
    } else {
      errorMessage = error
    }
    this.$notice.error({
      title: title || this.$i18n.t('messages.requestFailed'),
      desc: errorMessage
    })
  },
  redirectHome () {
    this.turnToPage(this.$store.state.app.appInfo.homePath,
      undefined, undefined, false, true)
  },
  redirectLogin (asyncFunc, isHoldTagNavList = false) {
    this.turnToPage({
      name: 'login'
    }, (callBackFunc) => {
      if (asyncFunc && typeof asyncFunc === 'function') {
        asyncFunc(() => {
          this.$store.commit('LOGIN_OUT')
          if (!isHoldTagNavList) {
            setTagNavListInLocalstorage([])
            this.$store.commit('SET_TAG_NAV_LIST', [])
          }
          callBackFunc(true)
        })
      } else {
        callBackFunc(true)
      }
    }, undefined, false, true)
  },
  redirectE404 () {
    this.turnToPage({
      name: 'E404',
      params: {
        redirect: this.$router.currentRoute.fullPath
      }
    })
  },
  redirectE500 (errorMsg) {
    this.turnToPage({
      name: 'E500',
      params: {
        msg: errorMsg,
        redirect: this.$router.currentRoute.fullPath
      }
    })
  },
  gotoPersonalInformation () {
    this.turnToPage({
      name: 'personalInformation'
    })
  },
  gotoLogFile () {
    this.turnToPage({
      name: 'logFile'
    })
  },
  gotoConfigCenter () {
    this.turnToPage({
      name: 'configCenter'
    })
  },
  gotoRouteConfig () {
    this.turnToPage({
      name: 'routeConfig'
    })
  },
  gotoRouteLog () {
    this.turnToPage({
      name: 'routeLog'
    })
  },
  /**
   * 页面跳转
   * @param obj 跳转参数 stirng | route
   * @param asyncFunc 跳转前执行的函数, asyncFunc(callBackFunc)
   * @param pageName 页面名称
   * @param closeMore 是否关闭多个页面标签
   * @param replace 是否是replace方式跳转
   */
  turnToPage (obj, asyncFunc, pageName, closeMore = false, replace = false) {
    let path = ''
    if (typeof obj === 'string') { // string
      path = obj
    } else { // route
      if (obj.path) {
        path = obj.path
      }
    }
    let targetMenu, currMenu
    currMenu = findMenuByPath(this.$router.currentRoute.fullPath, this.$store.state.app.user.menuList)
    if (path.startsWith('/') || path.toLowerCase().startsWith('http')) {
      if (this.$router.currentRoute.fullPath === path) {
        return
      }
      targetMenu = findMenuByPath(path, this.$store.state.app.user.menuList)
    } else {
      if (this.$router.currentRoute.name === path) {
        return
      }
    }
    let dataLose = false
    if (!closeMore) {
      if (this.$router.currentRoute.meta) {
        dataLose = this.$router.currentRoute.meta.withInput && this.$router.currentRoute.meta.notCache
      }
    } else {
      dataLose = true
    }
    if ((!targetMenu || targetMenu.openType !== 1) && dataLose) {
      const tagList = this.$store.state.app.tagNavList.filter(item => item.path !== this.$router.currentRoute.fullPath)
      this.$Modal.confirm({
        title: this.$i18n.t('dialog.confirm') + '',
        content: '<br/><p style="color: red">' + this.getPageTitle(pageName, currMenu) + '</p><br/>' +
          '<p>' + this.$i18n.t('messages.leavePage') + '</p>',
        onOk: () => {
          if (asyncFunc && typeof asyncFunc === 'function') {
            setTimeout(() => {
              asyncFunc((result) => {
                if (result) {
                  setTagNavListInLocalstorage(tagList)
                  this.$store.commit('SET_TAG_NAV_LIST', tagList)
                  this.routeSwitch(obj, targetMenu, replace)
                }
              })
            }, 350)
          } else {
            setTagNavListInLocalstorage(tagList)
            this.$store.commit('SET_TAG_NAV_LIST', tagList)
            this.routeSwitch(obj, targetMenu, replace)
          }
        }
      })
    } else {
      if (asyncFunc && typeof asyncFunc === 'function') {
        asyncFunc((result) => {
          if (result) {
            this.routeSwitch(obj, targetMenu, replace)
          }
        })
      } else {
        this.routeSwitch(obj, targetMenu, replace)
      }
    }
  },
  /**
   * 执行跳转
   * @param obj 跳转参数 stirng | route
   * @param menu 目标菜单对象
   * @param replace 是否是replace方式跳转
   */
  routeSwitch (obj, menu, replace) {
    let { name, params, query } = { name: '' }
    if (typeof obj === 'string') { // string
      name = obj
    } else { // route
      name = obj.name
      params = obj.params
      query = obj.query
    }
    let option = name
    if (name.startsWith('/') || name.toLowerCase().startsWith('http')) {
      if (menu) {
        switch (menu.openType) {
          case 0: // 内嵌模式
            option = menu.path
            break
          case 1: // 打开新页面
            window.open(menu.path)
            return
          default:
            option = menu.path
        }
      }
    } else {
      option = {
        name: name,
        params: params,
        query: query
      }
    }
    if (replace) {
      this.$router.replace(option)
    } else {
      this.$router.push(option)
    }
  },
  getPageTitle (pageName, pageMenu) {
    let pageTitle = pageName
    if (pageMenu) {
      pageTitle = pageMenu.name
    } else {
      if (this.$router.currentRoute.meta.title) {
        pageTitle = this.$i18n.t(this.$router.currentRoute.meta.title)
      }
    }
    return pageTitle
  },
  request: {}
}
export default ApiComm
