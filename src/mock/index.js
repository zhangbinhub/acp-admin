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
  getAllModuleFuncList,
  getModuleFuncInfo
} from './sysconfig/auth'
import { logFileList, downLoadLogFile } from './log/logFile'
import { deleteConfig, queryConfig, updateConfig, refreshConfig } from './config/configCenter'
import { deleteRoute, queryRoute, updateRoute, refreshRoute, queryRouteLog } from './route/routeConfig'

// 配置Ajax请求延时，可用来测试网络延迟大时项目中一些效果
Mock.setup({
  timeout: 1000
})

Mock.mock(/\/file\/upload/, /post/i, upLoadFile)
Mock.mock(/\/file\/download/, /post/i, downLoadFile)
Mock.mock(/\/oauth\/token/, /post/i, login)
Mock.mock(/\/oauth\/logout/, /post/i, logOut)
Mock.mock(/\/oauth\/onlineinfo/, /get/i, onlineInfo())
Mock.mock(/\/oauth\/logininfo/, /get/i, loginInfo())
Mock.mock(/\/oauth\/userinfo/, /get/i, userInfo)
Mock.mock(/\/oauth\/menulist/, /get/i, menuList)
Mock.mock(/\/oauth\/userinfo/, /(patch)|(put)/i, function (options) {
  return Object.assign(userInfo(), JSON.parse(options.body))
})
Mock.mock(/\/oauth\/runtime/, /(get)|(put)|(patch)/i, updateRuntime)
Mock.mock(/\/oauth\/runtime/, /delete/i, deleteRuntime)
Mock.mock(/\/oauth\/runtime/, /post/i, queryRuntime)
Mock.mock(/\/oauth\/app/, /(put)|(patch)/i, updateApp)
Mock.mock(/\/oauth\/app\/updatesecret/, /get/i, updateApp)
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
Mock.mock(/\/oauth\/moduserlist/, /get/i, getModUserList)
Mock.mock(/\/oauth\/role\/rolecodes/, /get/i, getRoleCodeList)
Mock.mock(/\/oauth\/role\/.*/, /get/i, getRoleInfo)
Mock.mock(/\/oauth\/role/, /get/i, getRoleList)
Mock.mock(/\/oauth\/role/, /put/i, updateRole)
Mock.mock(/\/oauth\/role/, /patch/i, function (options) {
  return Object.assign(updateRole(), JSON.parse(options.body))
})
Mock.mock(/\/oauth\/role/, /delete/i, deleteRole)
Mock.mock(/\/oauth\/role\/rolelist\/.*/, /get/i, getRoleListOption)
Mock.mock(/\/oauth\/auth\/menulist\/.*/, /get/i, getMenuListByAppId)
Mock.mock(/\/oauth\/auth\/modulefunclist\/.*/, /get/i, getModuleFuncListByAppId)
Mock.mock(/\/oauth\/auth\/modulefunccodes/, /get/i, getModuleFuncCodeList)
Mock.mock(/\/oauth\/auth\/menu/, /get/i, getAllMenuList)
Mock.mock(/\/oauth\/auth\/menu/, /put/i, getMenuInfo)
Mock.mock(/\/oauth\/auth\/menu\/.*/, /get/i, getMenuInfo)
Mock.mock(/\/oauth\/auth\/menu/, /patch/i, function (options) {
  return Object.assign(getMenuInfo(), JSON.parse(options.body))
})
Mock.mock(/\/oauth\/auth\/menu/, /delete/i, deleteAuth)
Mock.mock(/\/oauth\/auth\/modulefunc/, /get/i, getAllModuleFuncList)
Mock.mock(/\/oauth\/auth\/modulefunc/, /put/i, getModuleFuncInfo)
Mock.mock(/\/oauth\/auth\/modulefunc\/.*/, /get/i, getModuleFuncInfo)
Mock.mock(/\/oauth\/auth\/modulefunc/, /patch/i, function (options) {
  return Object.assign(getModuleFuncInfo(), JSON.parse(options.body))
})
Mock.mock(/\/oauth\/auth\/modulefunc/, /delete/i, deleteAuth)
Mock.mock(/\/oauth\/user/, /post/i, getUserList)
Mock.mock(/\/oauth\/user/, /delete/i, deleteUser)
Mock.mock(/\/oauth\/user\/resetpwd\/.*/, /get/i, resetSuccess)
Mock.mock(/\/oauth\/user/, /(put)|(patch)/i, updateUser)
Mock.mock(/\/log\/files/, /post/i, logFileList)
Mock.mock(/\/log\/files\/.*/, /get/i, downLoadLogFile)
Mock.mock(/\/config\/properties/, /(put)|(patch)/i, updateConfig)
Mock.mock(/\/config\/properties/, /delete/i, deleteConfig)
Mock.mock(/\/config\/properties\/refresh/, /post/i, refreshConfig)
Mock.mock(/\/config\/properties\/refresh\/application/, /post/i, refreshConfig)
Mock.mock(/\/config\/properties\/refresh\/matcher/, /post/i, refreshConfig)
Mock.mock(/\/config\/properties/, /post/i, queryConfig)
Mock.mock(/\/route\/gatewayroute/, /(put)|(patch)/i, updateRoute)
Mock.mock(/\/route\/gatewayroute/, /delete/i, deleteRoute)
Mock.mock(/\/route\/gatewayroute\/refresh/, /post/i, refreshRoute)
Mock.mock(/\/route\/gatewayroutelog/, /post/i, queryRouteLog)
Mock.mock(/\/route\/gatewayroute/, /post/i, queryRoute)
