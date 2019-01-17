import ApiComm from '../ApiComm'

export default {
  getModifiableUser: () => {
    return ApiComm.$http.get('/oauth/moduserlist')
  }
}
