import ApiComm from './ApiComm'
import Qs from 'qs'
import sha256 from 'js-sha256'

export default {
  login: (username, password) => {
    const date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    month = month < 10 ? ('0' + month) : month
    let day = date.getDate()
    day = day < 10 ? ('0' + day) : day
    let hour = date.getHours()
    hour = hour < 10 ? ('0' + hour) : hour
    password = sha256.sha256(sha256.sha256(sha256.sha256(password) + username) + year + month + day + hour)
    return ApiComm.$http.post('/oauth/token', {
      grant_type: 'password',
      username: username,
      password: password
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Process400': 'false'
      },
      auth: {
        username: ApiComm.$store.state.app.request.client_id,
        password: ApiComm.$store.state.app.request.client_secret
      },
      transformRequest: [function (data) {
        data = Qs.stringify(data)
        return data
      }]
    })
  },
  getMenus: () => {
    return ApiComm.$http.get('/oauth/menulist')
  }
}
