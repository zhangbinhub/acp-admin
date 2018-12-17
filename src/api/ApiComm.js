const ApiComm = {
  $notice: undefined,
  $i18n: undefined,
  $http: undefined,
  $store: undefined,
  install: function (Vue, options) {
    Vue.prototype.$api = ApiComm
    this.$notice = options.notice
    this.$i18n = options.i18n
    this.$http = options.http
    this.$store = options.store
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
  request: {}
}
export default ApiComm
