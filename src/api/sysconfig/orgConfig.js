import ApiComm from '../ApiComm'

export default {
  getOrgList () {
    return ApiComm.$http.get('/oauth/org')
  }
}
