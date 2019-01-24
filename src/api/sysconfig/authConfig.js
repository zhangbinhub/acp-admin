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
  },
  getAllMenuList: () => {
    return ApiComm.$http.get('/oauth/auth/menu')
  },
  createMenu: (menuInfo) => {
    return ApiComm.$http.put('/oauth/auth/menu', menuInfo)
  },
  deleteMenu: (idList) => {
    return ApiComm.$http.delete('/oauth/auth/menu', {
      data: idList
    })
  },
  getMenuInfo: (menuId) => {
    return ApiComm.$http.get('/oauth/auth/menu/' + menuId)
  },
  doUpdateMenu: (menuInfo) => {
    return ApiComm.$http.patch('/oauth/auth/menu', menuInfo)
  },
  getModuleFuncCodeList: () => {
    return ApiComm.$http.get('/oauth/auth/modulefunccodes')
  },
  getAllModuleFuncList: () => {
    return ApiComm.$http.get('/oauth/auth/modulefunc')
  },
  createModuleFunc: (moduleFuncInfo) => {
    return ApiComm.$http.put('/oauth/auth/modulefunc', moduleFuncInfo)
  },
  deleteModuleFunc: (idList) => {
    return ApiComm.$http.delete('/oauth/auth/modulefunc', {
      data: idList
    })
  },
  getModuleFuncInfo: (moduleFuncId) => {
    return ApiComm.$http.get('/oauth/auth/modulefunc/' + moduleFuncId)
  },
  doUpdateModuleFunc: (moduleFuncInfo) => {
    return ApiComm.$http.patch('/oauth/auth/modulefunc', moduleFuncInfo)
  }
}
