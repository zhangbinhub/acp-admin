import ApiComm from './ApiComm'
import Qs from 'qs'

export default {
  login: (username, password) => {
    return ApiComm.$http.post('/api/oauth/token', {
      grant_type: 'password',
      username: username,
      password: password
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
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
  }
}
