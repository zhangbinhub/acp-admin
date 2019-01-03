const ApiComm = {
  $notice: undefined,
  $i18n: undefined,
  $http: undefined,
  $store: undefined,
  $router: undefined,
  $loading: undefined,
  install: function (Vue, options) {
    Vue.prototype.$api = ApiComm
    this.$notice = options.notice
    this.$i18n = options.i18n
    this.$http = options.http
    this.$store = options.store
    this.$router = options.router
    this.$loading = options.loading

    // 请求拦截器
    this.$http.interceptors.request.use(config => {
      ApiComm.$loading.start()
      if (ApiComm.$store.state.app.user.token) {
        config.headers.Authorization = `${ApiComm.$store.state.app.user.tokenType} ${ApiComm.$store.state.app.user.token}`
      }
      return config
    }, error => {
      ApiComm.$loading.error()
      ApiComm.errorProcess(error)
      return Promise.reject(error)
    })

    // 响应拦截器
    this.$http.interceptors.response.use(data => {
      ApiComm.$loading.finish()
      return data
    }, error => {
      ApiComm.$loading.error()
      if (error.response) {
        switch (error.response.status) {
          case 400:
            if (!error.config.headers.Process400 || error.config.headers.Process400 !== 'false') {
              ApiComm.errorProcess(error)
            }
            break
          case 401:
            ApiComm.redirectLogin()
            return
          case 403:
            error.response.data.error_description = ApiComm.$i18n.t('messages.failed403')
            break
          case 500:
            let errorMsg = 'Internal System Error'
            if (error.response.data) {
              if (typeof error.response.data === 'string') {
                errorMsg = String(error.response.data)
              } else {
                if (error.response.data.error_description) {
                  errorMsg = error.response.data.error_description
                } else {
                  errorMsg = error.response.data.message
                }
              }
            }
            ApiComm.redirectE500(errorMsg)
            return
        }
        return Promise.reject(error)
      }
      ApiComm.errorProcess(error)
    })
  },
  errorProcess: function (error, title) {
    let errorMessage = ''
    if (error.response) {
      if (typeof error.response.data === 'string') {
        errorMessage = String(error.response.data)
      } else {
        if (error.response.data.error_description) {
          errorMessage = error.response.data.error_description
        } else {
          errorMessage = error.response.data.message
        }
      }
    } else {
      errorMessage = error
    }
    ApiComm.$notice.error({
      title: title || ApiComm.$i18n.t('messages.requestFailed'),
      desc: errorMessage
    })
  },
  redirectHome: () => {
    ApiComm.$router.replace(ApiComm.$store.state.app.appInfo.homePath)
  },
  redirectLogin: () => {
    ApiComm.$store.commit('LOGIN_OUT')
    ApiComm.$router.replace({
      name: 'login',
      params: { redirect: ApiComm.$router.currentRoute.fullPath }
    })
  },
  redirectE500: (errorMsg) => {
    ApiComm.$router.push({
      name: 'E500',
      params: { msg: errorMsg }
    })
  },
  gotoPersonalInformation: () => {
    ApiComm.$router.push({
      name: 'personal_information'
    })
  },
  request: {}
}
export default ApiComm
