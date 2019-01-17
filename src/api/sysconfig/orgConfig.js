import ApiComm from '../ApiComm'

export default {
  getOrgList () {
    return ApiComm.$http.get('/oauth/org')
  },
  getOrgInfo (orgId) {
    return ApiComm.$http.get('/oauth/org/' + orgId)
  },
  createOrg (orgInfo) {
    return ApiComm.$http.put('/oauth/org', orgInfo)
  },
  deleteOrg (orgIds) {
    return ApiComm.$http.delete('/oauth/org', {
      data: orgIds
    })
  },
  doUpdateOrg (orgInfo) {
    return ApiComm.$http.patch('/oauth/org', orgInfo)
  }
}
