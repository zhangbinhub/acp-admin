import Mock from 'mockjs'

import { upLoadFile, downLoadFile } from './file/file'
import { login, logOut, userInfo, menuList, onlineInfo, loginInfo } from './oauth/oauth'
import { deleteRuntime, queryRuntime, updateRuntime } from './sysconfig/runtime'
import { getAppList, deleteApp, queryApp, updateApp } from './sysconfig/application'
import { getOrgList, getOrgInfo, deleteOrg } from './sysconfig/organization'
import { getModUserList, getUserList, updateUser, deleteUser, resetSuccess } from './sysconfig/user'
import { getRoleCodeList, getRoleList, getRoleInfo, updateRole, deleteRole, getRoleListOption } from './sysconfig/role'
import {
  getMenuListByAppId,
  getModuleFuncListByAppId,
  getModuleFuncCodeList,
  getAllMenuList,
  getMenuInfo,
  deleteAuth,
  getModuleFuncInfo
} from './sysconfig/auth'
import { logFileList, downLoadLogFile, queryRouteLog, queryOperateLog, queryLoginLog } from './log/log'
import { deleteRoute, queryRoute, updateRoute, refreshRoute } from './route/routeConfig'

// 配置Ajax请求延时，可用来测试网络延迟大时项目中一些效果
Mock.setup({
  timeout: 1000
})

Mock.mock(/\/file\/upload/, /post/i, upLoadFile)
Mock.mock(/\/file\/download/, /post/i, downLoadFile)
Mock.mock(/\/oauth\/token/, /post/i, login)
Mock.mock(/\/oauth\/logout/, /post/i, logOut)
Mock.mock(/\/oauth\/online-info/, /get/i, onlineInfo())
Mock.mock(/\/oauth\/user-info/, /get/i, userInfo)
Mock.mock(/\/oauth\/menu-list/, /get/i, menuList)
Mock.mock(/\/oauth\/user-info/, /(patch)|(put)/i, function (options) {
  return Object.assign(userInfo(), JSON.parse(options.body))
})
Mock.mock(/\/oauth\/runtime/, /(get)|(put)|(patch)/i, updateRuntime)
Mock.mock(/\/oauth\/runtime/, /delete/i, deleteRuntime)
Mock.mock(/\/oauth\/runtime/, /post/i, queryRuntime)
Mock.mock(/\/oauth\/app/, /(put)|(patch)/i, updateApp)
Mock.mock(/\/oauth\/app\/update-secret/, /get/i, updateApp)
Mock.mock(/\/oauth\/app/, /get/i, getAppList)
Mock.mock(/\/oauth\/app/, /delete/i, deleteApp)
Mock.mock(/\/oauth\/app/, /post/i, queryApp)
Mock.mock(/\/oauth\/org\/.*/, /get/i, getOrgInfo)
Mock.mock(/\/oauth\/org/, /get/i, getOrgList)
Mock.mock(/\/oauth\/org/, /put/i, getOrgInfo)
Mock.mock(/\/oauth\/org/, /patch/i, function (options) {
  return Object.assign(getOrgInfo(), JSON.parse(options.body))
})
Mock.mock(/\/oauth\/org/, /delete/i, deleteOrg)
Mock.mock(/\/oauth\/mod-user-list/, /get/i, getModUserList)
Mock.mock(/\/oauth\/role\/role-code-list/, /get/i, getRoleCodeList)
Mock.mock(/\/oauth\/role\/.*/, /get/i, getRoleInfo)
Mock.mock(/\/oauth\/role/, /get/i, getRoleList)
Mock.mock(/\/oauth\/role/, /put/i, updateRole)
Mock.mock(/\/oauth\/role/, /patch/i, function (options) {
  return Object.assign(updateRole(), JSON.parse(options.body))
})
Mock.mock(/\/oauth\/role/, /delete/i, deleteRole)
Mock.mock(/\/oauth\/role\/role-list\/.*/, /get/i, getRoleListOption)
Mock.mock(/\/oauth\/auth\/menu-list\/.*/, /get/i, getMenuListByAppId)
Mock.mock(/\/oauth\/auth\/module-func-list\/.*/, /get/i, getModuleFuncListByAppId)
Mock.mock(/\/oauth\/auth\/module-func-code-list/, /get/i, getModuleFuncCodeList)
Mock.mock(/\/oauth\/auth\/menu/, /get/i, getAllMenuList)
Mock.mock(/\/oauth\/auth\/menu/, /put/i, function (options) {
  return Object.assign({ id: 'testId' }, JSON.parse(options.body))
})
Mock.mock(/\/oauth\/auth\/menu\/.*/, /get/i, getMenuInfo)
Mock.mock(/\/oauth\/auth\/menu/, /patch/i, function (options) {
  return Object.assign(getMenuInfo(), JSON.parse(options.body))
})
Mock.mock(/\/oauth\/auth\/menu/, /delete/i, deleteAuth)
Mock.mock(/\/oauth\/auth\/module-func/, /get/i, function (options) {
  return Object.assign({ id: 'testId' }, JSON.parse(options.body))
})
Mock.mock(/\/oauth\/auth\/module-func/, /put/i, getModuleFuncInfo)
Mock.mock(/\/oauth\/auth\/module-func\/.*/, /get/i, getModuleFuncInfo)
Mock.mock(/\/oauth\/auth\/module-func/, /patch/i, function (options) {
  return Object.assign(getModuleFuncInfo(), JSON.parse(options.body))
})
Mock.mock(/\/oauth\/auth\/module-func/, /delete/i, deleteAuth)
Mock.mock(/\/oauth\/user/, /post/i, getUserList)
Mock.mock(/\/oauth\/user/, /delete/i, deleteUser)
Mock.mock(/\/oauth\/user\/reset-pwd\/.*/, /get/i, resetSuccess)
Mock.mock(/\/oauth\/user/, /(put)|(patch)/i, updateUser)
Mock.mock(/\/route\/gateway-route/, /(put)|(patch)/i, updateRoute)
Mock.mock(/\/route\/gateway-route/, /delete/i, deleteRoute)
Mock.mock(/\/route\/gateway-route\/refresh/, /post/i, refreshRoute)
Mock.mock(/\/route\/gateway-route/, /post/i, queryRoute)
Mock.mock(/\/log\/files/, /post/i, logFileList)
Mock.mock(/\/log\/files\/.*/, /get/i, downLoadLogFile)
Mock.mock(/\/log\/gateway-route-log/, /post/i, queryRouteLog)
Mock.mock(/\/log\/operate-log/, /post/i, queryOperateLog)
Mock.mock(/\/log\/login-log/, /post/i, queryLoginLog)
Mock.mock(/\/log\/login-info/, /get/i, loginInfo)
