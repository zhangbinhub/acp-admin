import ApiComm from '../ApiComm'
import Qs from 'qs'
import sha256 from 'js-sha256'

export default {
  doLogin: (loginNo, password) => {
    const date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    month = month < 10 ? ('0' + month) : month
    let day = date.getDate()
    day = day < 10 ? ('0' + day) : day
    let hour = date.getHours()
    hour = hour < 10 ? ('0' + hour) : hour
    password = sha256.sha256(sha256.sha256(sha256.sha256(password) + loginNo) + year + month + day + hour)
    return ApiComm.$http.post('/oauth/token', {
      grant_type: 'password',
      username: loginNo,
      password: password
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Process400': 'false',
        'Process401': 'false',
        'Process403': 'false'
      },
      auth: {
        username: ApiComm.$store.state.app.appInfo.appId,
        password: ApiComm.$store.state.app.appInfo.appSecret
      },
      transformRequest: [function (data) {
        data = Qs.stringify(data)
        return data
      }]
    })
  },
  doLogOut: () => {
    return ApiComm.$http.post('/oauth/logout')
  },
  getUserInfo: () => {
    return ApiComm.$http.get('/oauth/user-info')
  },
  updateUserInfo: (userInfo) => {
    if (userInfo.oldPassword) {
      userInfo.oldPassword = sha256.sha256(sha256.sha256(userInfo.oldPassword) + ApiComm.$store.state.app.user.userInfo.loginNo)
    }
    if (userInfo.password) {
      userInfo.password = sha256.sha256(sha256.sha256(userInfo.password) + ApiComm.$store.state.app.user.userInfo.loginNo)
    }
    return ApiComm.$http.patch('/oauth/user-info', userInfo)
  },
  getOnlineInfo: () => {
    return ApiComm.$http.get('/oauth/online-info')
  }
}
