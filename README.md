# acp-admin

###### v4.2.4 [版本更新日志](doc/version_history.md)

## 浏览器兼容性

> 由于js-base64 3.0及以上版本不再支持IE，因此从4.2.0开始不再支持IE

支持的浏览器：

- Chrome latest（推荐，完美）
- Firefox latest（完全支持）
- Edge（完全支持）

## 简介

> 使用vue全家桶(Vue+Vue-router+Vuex+axios)、ElementUI样式库构建的前端项目。该项目是前后端分离架构中的“前端部分” 。后端工程[V4.2.4](https://github.com/zhangbin1010/acp-admin-cloud)

> 系统仍持续完善和优化中，数据初始化及后端数据结构请参看[后端工程](https://github.com/zhangbin1010/acp-admin-cloud)

## 相关组件官方文档

- [Vue](http://www.runoob.com/vue2/vue-tutorial.html)
- [Vue CLI 4](https://cli.vuejs.org/zh/)
- [ElementUI](https://element.eleme.cn/#/zh-CN)
- [echarts](https://www.echartsjs.com/index.html)
- [cropperjs](https://github.com/fengyuanchen/cropperjs)

## 技术栈

- webpack
- nodejs
- vue2
- vue cli 4
- vuex
- vue-router
- axios
- echarts
- cropperjs
- mockjs
- js-sha256
- js-base64
- vue-json-editor
- Element-UI
- vue-count-to

## 总体架构

![Architecture diagram](doc/images/总体架构.jpg)

#### 说明

> - 前后端交互 HttpStatus Code 说明
    >
    >     | HttpStatus | 描述 |
    >     | --- | --- |
    >     | 200 | 请求成功 |
    >     | 201 | 资源创建成功 |
    >     | 400 | 业务错误 |
    >     | 401 | token（登录）失效 |
    >     | 403 | 权限不足 |
    >     | 404 | 找不到资源 |
    >     | 500 | 系统异常 |

## 部署运行

该工程默认运行于 nodejs 中，也可根据实际需要运行在其他 web 容器

## 一、环境搭建

##### （一）安装 [node.js](http://nodejs.cn)，并验证

``` bash
node -v
```

##### （二）安装淘宝 npm 镜像

安装 cnpm ，之后使用 cnpm 代替 npm

``` bash
npm install -g cnpm --registry=https://registry.npm.taobao.org
```

或直接配置

```bash
npm config set registry https://registry.npm.taobao.org
```

##### （三）安装升级插件

```bash
npm install -g npm-check-updates
```

## 二、依赖插件

##### （一）安装

``` bash
npm install
```

##### （二）更新

``` bash
ncu -u
npm install
```

## 三、开发

##### （一）国际化

- 语言包路径：src/lang
- 在语言包路径下新增或修改语言属性
- 在 src/lang/index.js 中加载新的语言包

##### （二）mock

- 如果要使用 mock，在 src/main.js 中加入 import './mock' 即可
- src/mock 中添加或修改 mock 信息
- src/mock/index.js 中引入，并配置相应的 url 拦截策略

##### （三）配置文件

1、全局工程配置文件

[vue.config.js](vue.config.js)

[配置参考](https://cli.vuejs.org/zh/config/#css-loaderoptions)

2、项目配置文件
> - 持久化组件：vuex
> - 路径：src/store
> - 入口：[src/store/index.js](src/store/index.js)
> - 系统信息配置文件：[src/store/config/appInfo.js](src/store/config/appInfo.js)

##### （四）静态资源

> - 路径：src/assets

##### （五）Router

> - 组件：vue-router
> - 路径：src/router
> - 入口：[src/router/index.js](src/router/index.js)
> - 路由配置及说明：[src/router/routers.js](src/router/routers.js)

##### （六）http 请求

> - 组件：axios、vue-axios
> - 入口及全局配置：[src/plugins/plugin-axios.js](src/plugins/plugin-axios.js)
> - 请求 api
    >

- 路径：src/api

> - 入口：[src/api/index.js](src/api/index.js)
    >
- api 编写：新增或修改文件，在[src/api/ApiLists.js](src/api/ApiLists.js)中引入并配置

##### （七）页面布局

> - 独立页面路径：src/components/pages
> - 布局框架：src/components/layout
> - 框架内页面：src/components/views
> - 测试页面：src/components/test
> - src/components 下其他路径存放自定义组件

## 四、界面展示

- 登录
  ![images](doc/images/pages/login.png)
- 首页
  ![images](doc/images/pages/index.png)
- 个人信息
  ![images](doc/images/pages/userinfo.png)
- 头像裁剪
  ![images](doc/images/pages/avatar.png)
- 应用配置
  ![images](doc/images/pages/appconfig.png)
  ![images](doc/images/pages/appedit.png)
  ![images](doc/images/pages/appupdate.png)
- 菜单配置
  ![images](doc/images/pages/menu.png)
- 模块功能配置
  ![images](doc/images/pages/module.png)
- 机构配置
  ![images](doc/images/pages/org.png)
- 角色配置
  ![images](doc/images/pages/role.png)
- 运行参数配置
  ![images](doc/images/pages/runtime.png)
  ![images](doc/images/pages/runtimeedit.png)
- 用户配置
  ![images](doc/images/pages/userlist.png)
- 用户编辑
  ![images](doc/images/pages/useredit.png)
- 404页面
  ![images](doc/images/pages/404.png)
- 500页面
  ![images](doc/images/pages/500.png)
- 后台日志文件查询、下载
  ![images](doc/images/pages/logfile.png)
- 路由配置
  ![images](doc/images/pages/route.png)
  ![images](doc/images/pages/routeEdit.png)
  ![images](doc/images/pages/routeRefresh.png)
- 路由日志
  ![images](doc/images/pages/routeLog.png)
- 操作日志
  ![images](doc/images/pages/operateLog.png)
- 登录日志
  ![images](doc/images/pages/loginLog.png)
- demo
    - 文件上传
      ![images](doc/images/pages/upload.png)

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
