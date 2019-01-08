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
        'Process403': 'false'
      },
      auth: {
        username: ApiComm.$store.state.app.appInfo.client_id,
        password: ApiComm.$store.state.app.appInfo.client_secret
      },
      transformRequest: [function (data) {
        data = Qs.stringify(data)
        return data
      }]
    })
  },
  getUserInfo: () => {
    return ApiComm.$http.get('/oauth/userinfo')
  },
  getMenus: () => {
    return ApiComm.$http.get('/oauth/menulist')
  },
  updateUserInfo: (userInfo) => {
    if (userInfo.old_password) {
      userInfo.old_password = sha256.sha256(sha256.sha256(userInfo.old_password) + ApiComm.$store.state.app.user.userInfo.loginno)
    }
    if (userInfo.password) {
      userInfo.password = sha256.sha256(sha256.sha256(userInfo.password) + ApiComm.$store.state.app.user.userInfo.loginno)
    }
    return ApiComm.$http.patch('/oauth/userinfo', userInfo)
  }
}
