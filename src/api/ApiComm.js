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
      if (ApiComm.$store.state.app.userInfo.token) {
        config.headers.Authorization = `${ApiComm.$store.state.app.userInfo.tokenType} ${ApiComm.$store.state.app.userInfo.token}`
      }
      return config
    }, error => {
      ApiComm.$loading.error()
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
          case 401:
            ApiComm.redirectLogin()
        }
      }
      return Promise.reject(error)
    })
  },
  errorProcess: function (error, title) {
    let errorMessage = ''
    if (error.response) {
      errorMessage = error.response.data.error_description
    } else {
      errorMessage = error
    }
    ApiComm.$notice.error({
      title: title || ApiComm.$i18n.t('messages.requestFailed'),
      desc: errorMessage
    })
  },
  redirectLogin: () => {
    ApiComm.$store.commit('LOGIN_OUT')
    ApiComm.$router.replace({
      path: '/login',
      query: { redirect: ApiComm.$router.currentRoute.fullPath }
    })
  },
  request: {}
}
export default ApiComm
