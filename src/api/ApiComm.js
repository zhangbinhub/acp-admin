import {buildRouteParams, deepEqual, findMenuByPath} from '@/libs/tools'

const ApiComm = {
  $confirm: undefined,
  $notify: undefined,
  $i18n: undefined,
  $http: undefined,
  $store: undefined,
  $router: undefined,
  $loading: undefined,
  install: function (app, options) {
    app.config.globalProperties.$api = this
    this.$confirm = options.confirm
    this.$notify = options.notify
    this.$i18n = options.i18n
    this.$http = options.http
    this.$store = options.store
    this.$router = options.router
    this.$loading = options.loading

    // 请求拦截器
    this.$http.interceptors.request.use(config => {
      this.$loading.start()
      if (this.$store.state.app.user.token) {
        config.headers.Authorization = `${this.$store.state.app.user.tokenType} ${this.$store.state.app.user.token}`
      }
      return config
    }, error => {
      this.$loading.done()
      this.errorProcess(error)
      return Promise.reject(error)
    })

    // 响应拦截器
    this.$http.interceptors.response.use(data => {
      this.$loading.done()
      return data
    }, error => {
      this.$loading.done()
      if (error.response) {
        switch (error.response.status) {
          case 400: // 业务错误
            if (!error.config.headers.Process400 || error.config.headers.Process400 !== 'false') {
              // 默认处理方式
              this.errorProcess(error)
              return
            }
            break
          case 401: // token 失效
            if (!error.config.headers.Process401 || error.config.headers.Process401 !== 'false') {
              // 默认处理方式
              this.redirectLogin()
              return
            }
            break
          case 403: // 权限不足
            error.response.data.errorDescription = this.$i18n.global.t('messages.failed403')
            if (!error.config.headers.Process403 || error.config.headers.Process403 !== 'false') {
              // 默认处理方式
              this.errorProcess(error)
              return
            }
            break
          case 404: // 找不到资源
            error.response.data.errorDescription = this.$i18n.global.t('messages.failed404')
            if (!error.config.headers.Process404) {
              // 默认处理方式
              this.redirectE404()
              return
            } else {
              if (error.config.headers.Process404 !== 'false') {
                // 默认处理方式
                this.redirectE404()
                return
              } else {
                if (error.config.headers.Process404Page) {
                  if (error.config.headers.Process404Page === 'true') {
                    this.redirectE404()
                    return
                  } else {
                    this.errorProcess(error)
                    return
                  }
                }
              }
            }
            break
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
      }
      return Promise.reject(error)
    })
  },
  errorProcess(error, title) {
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
    this.$notify.error({
      title: title || this.$i18n.global.t('messages.requestFailed'),
      message: errorMessage
    })
  },
  redirectHome() {
    this.turnToPage(this.$store.state.app.appInfo.homePath,
      undefined, undefined, false, true)
  },
  redirectLogin(asyncFunc, isHoldTagNavList = false) {
    this.turnToPage({
      name: 'login'
    }, (callBackFunc) => {
      const doLogOut = () => {
        this.$store.commit('LOGIN_OUT')
        if (!isHoldTagNavList) {
          this.$store.commit('SET_TAG_NAV_LIST', [])
        }
      }
      if (asyncFunc && typeof asyncFunc === 'function') {
        asyncFunc(() => {
          doLogOut()
          callBackFunc(true)
        })
      } else {
        doLogOut()
        callBackFunc(true)
      }
    }, undefined, false, true)
  },
  redirectE404() {
    this.turnToPage({
      name: 'E404',
      params: {
        redirect: this.$router.currentRoute.value.fullPath
      }
    })
  },
  redirectE500(errorMsg) {
    this.turnToPage({
      name: 'E500',
      params: {
        msg: errorMsg,
        redirect: this.$router.currentRoute.value.fullPath
      }
    })
  },
  gotoPersonalInformation() {
    this.turnToPage({
      name: 'personalInformation'
    })
  },
  gotoLogFile() {
    this.turnToPage({
      name: 'logFile'
    })
  },
  gotoRouteConfig() {
    this.turnToPage({
      name: 'routeConfig'
    })
  },
  gotoRouteLog() {
    this.turnToPage({
      name: 'routeLog'
    })
  },
  gotoDeploy() {
    this.turnToPage({
      name: 'deploy'
    })
  },
  /**
   * 页面跳转
   * @param obj 跳转参数 stirng | route
   * @param asyncFunc 跳转前执行的函数, asyncFunc(callBackFunc);
   *                  参数为一个函数，callBackFunc函数内容就是具体执行页面跳转;
   *                  callBackFunc函数接收一个参数pass，当pass为true时执行页面跳转，当pass不为true时什么事都不做
   * @param pageName 页面名称
   * @param closeMore 是否关闭多个页面标签
   * @param replace 是否是replace方式跳转
   */
  turnToPage(obj, asyncFunc, pageName, closeMore = false, replace = false) {
    let query = {}
    let pathOrName = ''
    if (typeof obj === 'string') { // string
      pathOrName = obj
    } else { // route
      if (obj.path) {
        pathOrName = obj.path
      } else if (obj.name) {
        pathOrName = obj.name
      } else {
        return
      }
      query = obj.query || {}
    }
    let targetMenu, currMenu
    currMenu = findMenuByPath(this.$router.currentRoute.value.fullPath, this.$store.state.app.user.menuList)
    if (pathOrName.startsWith('/') || pathOrName.toLowerCase().startsWith('http')) {
      // 直接路由跳转 或 外部链接跳转
      if (!closeMore) {
        if (this.$router.currentRoute.value.fullPath === pathOrName) {
          return
        }
      }
      targetMenu = findMenuByPath(pathOrName, this.$store.state.app.user.menuList)
    } else {
      // 路由名称跳转
      if (!closeMore) {
        if (this.$router.currentRoute.value.name === pathOrName) {
          let currentQuery = this.$router.currentRoute.value.query || {}
          if (deepEqual(currentQuery, query)) {
            return
          }
        }
      }
    }
    let dataLose = false
    if (!closeMore) {
      if (this.$router.currentRoute.value.meta) {
        dataLose = this.$router.currentRoute.value.meta.withInput && this.$router.currentRoute.value.meta.notCache
      }
    } else {
      dataLose = true
    }
    const process = (lazyTime) => {
      if (asyncFunc && typeof asyncFunc === 'function') {
        const doAsyncFunc = () => {
          asyncFunc((pass) => {
            if (pass) {
              if (dataLose) {
                if (!closeMore) {
                  this.removeThisTag()
                }
              }
              ApiComm.routeSwitch(obj, targetMenu, replace)
            }
          })
        }
        if (lazyTime > 0) {
          setTimeout(() => {
            doAsyncFunc()
          }, lazyTime)
        } else {
          doAsyncFunc()
        }
      } else {
        if (dataLose) {
          if (!closeMore) {
            this.removeThisTag()
          }
        }
        ApiComm.routeSwitch(obj, targetMenu, replace)
      }
    }
    if ((!targetMenu || targetMenu.openType !== 1) && dataLose) {
      if (pathOrName === '/404' || pathOrName === '/500' || pathOrName === 'E404' || pathOrName === 'E500') {
        process(0)
      } else {
        this.$confirm(this.getPageTitle(pageName, currMenu) + ' ' +
          this.$i18n.global.t('messages.leavePage'), this.$i18n.global.t('dialog.confirm'), {
          type: 'warning'
        }).then(() => {
          process(350)
        }).catch(() => {
        })
      }
    } else {
      process(0)
    }
  },
  /**
   * 执行跳转
   * @param obj 跳转参数 stirng | route
   * @param menu 目标菜单对象
   * @param replace 是否是replace方式跳转
   */
  routeSwitch(obj, menu, replace) {
    let {pathOrName, params, query} = {pathOrName: '', query: {}, params: {}}
    if (typeof obj === 'string') { // string
      pathOrName = obj
    } else { // route
      if (obj.path) {
        pathOrName = obj.path
      } else if (obj.name) {
        pathOrName = obj.name
      } else {
        return
      }
      query = obj.query || {}
      params = obj.params || {}
    }
    let option = {}
    if (pathOrName.startsWith('/') || pathOrName.toLowerCase().startsWith('http')) {
      // path
      let path = pathOrName
      if (menu) {
        if (menu.openType === 1) {
          // 打开新页面
          window.open(path)
          return
        }
      }
      let routeQuery = query
      if (pathOrName.indexOf('?') > 0) {
        pathOrName.substring(pathOrName.indexOf('?') + 1).split('&').forEach((keyValue) => {
          if (keyValue.indexOf('=') > 0) {
            const map = keyValue.split('=')
            routeQuery[map[0]] = map[1]
          }
        })
      }
      option = {
        path: path,
        query: routeQuery
      }
      if (this.$router.currentRoute.value.fullPath === path) {
        return
      }
    } else {
      // name
      option = {
        name: pathOrName,
        params: buildRouteParams(params),
        query: query
      }
      if (this.$router.currentRoute.value.name === pathOrName) {
        let currentQuery = this.$router.currentRoute.value.query || {}
        if (deepEqual(currentQuery, query)) {
          return
        }
      }
    }
    if (replace) {
      this.$router.replace(option)
    } else {
      this.$router.push(option)
    }
  },
  getPageTitle(pageName, pageMenu) {
    let pageTitle = pageName
    if (!pageTitle) {
      if (pageMenu) {
        pageTitle = pageMenu.name
      } else {
        if (this.$router.currentRoute.value.meta.title) {
          pageTitle = this.$i18n.global.t(this.$router.currentRoute.value.meta.title)
        }
      }
    }
    return pageTitle
  },
  removeThisTag() {
    const res = this.$store.state.app.tagNavList.filter(item => item.path !== this.$router.currentRoute.value.fullPath)
    this.$store.commit('SET_TAG_NAV_LIST', res)
  },
  closeThisTagImmediately() {
    const currIndex = this.$store.state.app.tagNavList.findIndex(item => item.path === this.$router.currentRoute.value.fullPath)
    let nextPath = this.$store.state.app.appInfo.homePath
    if (currIndex === this.$store.state.app.tagNavList.length - 1) {
      nextPath = this.$store.state.app.tagNavList[this.$store.state.app.tagNavList.length - 2].path
    } else {
      nextPath = this.$store.state.app.tagNavList[currIndex + 1].path
    }
    this.removeThisTag()
    this.routeSwitch(nextPath)
  },
  request: {}
}
export default ApiComm
