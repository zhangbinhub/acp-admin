import ApiComm from '../ApiComm'

export default {
  getCodeList: () => {
    return ApiComm.$http.get('/oauth/role/rolecodes')
  },
  getList: () => {
    return ApiComm.$http.get('/oauth/role')
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
