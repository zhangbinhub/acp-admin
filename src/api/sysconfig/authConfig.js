import ApiComm from '../ApiComm'

export default {
  getMenus: () => {
    return ApiComm.$http.get('/oauth/menu-list')
  },
  getMenuList: (appId) => {
    return ApiComm.$http.get('/oauth/auth/menu-list/' + appId)
  },
  getModuleFuncList: (appId) => {
    return ApiComm.$http.get('/oauth/auth/module-func-list/' + appId)
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
    return ApiComm.$http.get('/oauth/auth/module-func-code-list')
  },
  getAllModuleFuncList: () => {
    return ApiComm.$http.get('/oauth/auth/module-func')
  },
  createModuleFunc: (moduleFuncInfo) => {
    return ApiComm.$http.put('/oauth/auth/module-func', moduleFuncInfo)
  },
  deleteModuleFunc: (idList) => {
    return ApiComm.$http.delete('/oauth/auth/module-func', {
      data: idList
    })
  },
  getModuleFuncInfo: (moduleFuncId) => {
    return ApiComm.$http.get('/oauth/auth/module-func/' + moduleFuncId)
  },
  doUpdateModuleFunc: (moduleFuncInfo) => {
    return ApiComm.$http.patch('/oauth/auth/module-func', moduleFuncInfo)
  }
}
