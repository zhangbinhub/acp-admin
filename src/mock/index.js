import Mock from 'mockjs'

import { login, userInfo, menuList } from './oauth/oauth'
import { deleteRuntime, queryRuntime, updateRuntime } from './sysconfig/runtime'
import { deleteApp, queryApp, updateApp } from './sysconfig/application'
import { getOrgList, getOrgInfo, deleteOrg } from './sysconfig/organization'
import { getModUserList } from './sysconfig/user'

// 配置Ajax请求延时，可用来测试网络延迟大时项目中一些效果
Mock.setup({
  timeout: 1000
})

Mock.mock(/\/oauth\/token/, /post/i, login)
Mock.mock(/\/oauth\/userinfo/, /get/i, userInfo)
Mock.mock(/\/oauth\/menulist/, /get/i, menuList)
Mock.mock(/\/oauth\/userinfo/, /(patch)|(put)/i, function (options) {
  return Object.assign(userInfo(), JSON.parse(options.body))
})
Mock.mock(/\/oauth\/runtime/, /(get)|(put)|(patch)/i, updateRuntime)
Mock.mock(/\/oauth\/runtime/, /delete/i, deleteRuntime)
Mock.mock(/\/oauth\/runtime/, /post/i, queryRuntime)
Mock.mock(/\/oauth\/app/, /(get)|(put)|(patch)/i, updateApp)
Mock.mock(/\/oauth\/app/, /delete/i, deleteApp)
Mock.mock(/\/oauth\/app/, /post/i, queryApp)
Mock.mock(/\/oauth\/org\/.*/, /get/i, getOrgInfo)
Mock.mock(/\/oauth\/org/, /get/i, getOrgList)
Mock.mock(/\/oauth\/org/, /put/i, getOrgInfo)
Mock.mock(/\/oauth\/org/, /patch/i, function (options) {
  return Object.assign(getOrgInfo(), JSON.parse(options.body))
})
Mock.mock(/\/oauth\/app/, /delete/i, deleteOrg)
Mock.mock(/\/oauth\/moduserlist/, /get/i, getModUserList)
