import Mock from 'mockjs'

import { login, userInfo, menuList } from './oauth/oauth'

// 配置Ajax请求延时，可用来测试网络延迟大时项目中一些效果
Mock.setup({
  timeout: 1000
})

Mock.mock(/\/oauth\/token/, /post/i, login)
Mock.mock(/\/oauth\/userinfo/, /get/i, userInfo)
Mock.mock(/\/oauth\/menulist/, /get/i, menuList)
Mock.mock(/\/oauth\/user/, /patch/i, function (options) {
  return Object.assign(userInfo(), JSON.parse(options.body))
})
