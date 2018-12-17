import Qs from 'qs'

const Apis = {
  $notice: undefined,
  $i18n: undefined,
  $http: undefined,
  $store: undefined,
  install: function (Vue, options) {
    Vue.prototype.$api = Apis
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
    Apis.$notice.error({
      title: title || Apis.$i18n.t('messages.requestFailed'),
      desc: errorMessage
    })
  },
  request: {
    login: function (username, password) {
      return Apis.$http.post('/oauth/2.0/oauth/token', {
        grant_type: 'password',
        username: username,
        password: password
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        auth: {
          username: 'test',
          password: 'test'
        },
        transformRequest: [function (data) {
          data = Qs.stringify(data)
          return data
        }]
      })
    }
  }
}
export default Apis
