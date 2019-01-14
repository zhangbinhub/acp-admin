import Mock from 'mockjs'

import { login, userInfo, menuList } from './oauth/oauth'
import { deleteParam, queryParam, updateParam } from './sysconfig/param'
import { deleteApp, queryApp, updateApp } from './sysconfig/application'

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
Mock.mock(/\/oauth\/param/, /(get)|(put)|(patch)/i, updateParam)
Mock.mock(/\/oauth\/param/, /delete/i, deleteParam)
Mock.mock(/\/oauth\/param/, /post/i, queryParam)
Mock.mock(/\/oauth\/app/, /(get)|(put)|(patch)/i, updateApp)
Mock.mock(/\/oauth\/app/, /delete/i, deleteApp)
Mock.mock(/\/oauth\/app/, /post/i, queryApp)
