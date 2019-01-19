import ApiComm from '../ApiComm'

export default {
  getMenus: () => {
    return ApiComm.$http.get('/oauth/menulist')
  },
  getMenuList: (appId) => {
    return ApiComm.$http.get('/oauth/auth/menulist/' + appId)
  },
  getModuleFuncList: (appId) => {
    return ApiComm.$http.get('/oauth/auth/modulefunclist/' + appId)
  }
}
