import ApiComm from '../ApiComm'

export default {
  getCodeList: () => {
    return ApiComm.$http.get('/oauth/role/role-code-list')
  },
  getList: () => {
    return ApiComm.$http.get('/oauth/role')
  },
  getRoleList: (appId) => {
    return ApiComm.$http.get('/oauth/role/role-list/' + appId)
  },
  getRoleInfo: (roleId) => {
    return ApiComm.$http.get('/oauth/role/' + roleId)
  },
  createRole: (roleInfo) => {
    return ApiComm.$http.put('/oauth/role', roleInfo)
  },
  deleteRole: (idList) => {
    return ApiComm.$http.delete('/oauth/role', {
      data: idList
    })
  },
  doUpdateRole: (roleInfo) => {
    return ApiComm.$http.patch('/oauth/role', roleInfo)
  }
}
