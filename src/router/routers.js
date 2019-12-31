import demo from './demo'

/**
 * name: 路由名称必须和对应页面组件名称一致，否则无法实现 keep-live
 * meta 附加参数说明（除原生参数外）
 * meta{
 *   title: 页面标题；值：i18n表达式。显示位置：1、浏览器网页title；2、面包屑名称（该路由没有对应的菜单时显示）；3、标签导航（该路由没有对应的菜单时显示）
 *   icon: 图标；值：图标样式。显示位置：面包屑名称前（该路由没有对应的菜单时显示）
 *   notCache: 主界面区域是否对该路由对应的组件进行缓存（缓存的组件name为该路由的name）；值：true | false | 不设置，默认进行缓存
 *   requireAuth: 访问该路由是否需要登录权限；值：true | false | 不设置，默认不进行登录验证
 *   withInput: 该路由对应的组件界面是否包含用户输入项；值：true | false| 不设置，默认为false；该值为true且notCache=true时，关闭标签前会进行询问，用户输入的数据不会进行缓存
 * }
 */
export default [{
  path: '/login',
  name: 'login',
  component: () => import('@/components/pages/Login.vue'),
  meta: {
    title: 'pageTitle.login'
  }
}, {
  path: '/404',
  name: 'E404',
  component: () => import('@/components/pages/E404.vue'),
  meta: {
    title: 'pageTitle.E404'
  }
}, {
  path: '/500',
  name: 'E500',
  component: () => import('@/components/pages/E500.vue'),
  meta: {
    title: 'pageTitle.E500'
  }
}, {
  path: '/',
  name: 'home',
  component: () => import('@/components/layout/Home.vue'),
  redirect: '/index',
  children: [{
    path: '/index',
    name: 'index',
    component: () => import('@/components/views/Index.vue'),
    meta: {
      title: 'pageTitle.home',
      notCache: true,
      requireAuth: true
    }
  }, ...demo, {
    path: '/personal-information',
    name: 'personalInformation',
    component: () => import('@/components/views/main/PersonalInformation.vue'),
    meta: {
      title: 'pageTitle.personalInformation',
      icon: 'el-icon-user',
      requireAuth: true
    }
  }, {
    path: '/route-config',
    name: 'routeConfig',
    component: () => import('@/components/views/main/RouteConfig.vue'),
    meta: {
      title: 'pageTitle.routeConfig',
      icon: 'el-icon-share',
      requireAuth: true
    }
  }, {
    path: '/route-log',
    name: 'routeLog',
    component: () => import('@/components/views/main/RouteLog.vue'),
    meta: {
      title: 'pageTitle.routeLog',
      icon: 'el-icon-reading',
      requireAuth: true
    }
  }, {
    path: '/log-file',
    name: 'logFile',
    component: () => import('@/components/views/main/LogFile.vue'),
    meta: {
      title: 'pageTitle.logFile',
      icon: 'el-icon-document',
      requireAuth: true
    }
  }, {
    path: '/operate-log',
    name: 'operateLog',
    component: () => import('@/components/views/monitor/OperateLog.vue'),
    meta: {
      title: 'pageTitle.operateLog',
      requireAuth: true
    }
  }, {
    path: '/login-log',
    name: 'loginLog',
    component: () => import('@/components/views/monitor/LoginLog.vue'),
    meta: {
      title: 'pageTitle.loginLog',
      requireAuth: true
    }
  }, {
    path: '/app-config',
    name: 'appConfig',
    component: () => import('@/components/views/sysConfig/ApplicationConfig.vue'),
    meta: {
      title: 'pageTitle.appConfig',
      requireAuth: true
    }
  }, {
    path: '/auth-config',
    name: 'authConfig',
    component: () => import('@/components/views/sysConfig/AuthConfig.vue'),
    meta: {
      title: 'pageTitle.authConfig',
      requireAuth: true
    }
  }, {
    path: '/org-config',
    name: 'orgConfig',
    component: () => import('@/components/views/sysConfig/OrgConfig.vue'),
    meta: {
      title: 'pageTitle.orgConfig',
      requireAuth: true
    }
  }, {
    path: '/runtime-config',
    name: 'runtimeConfig',
    component: () => import('@/components/views/sysConfig/RuntimeConfig.vue'),
    meta: {
      title: 'pageTitle.runtimeConfig',
      requireAuth: true
    }
  }, {
    path: '/role-config',
    name: 'roleConfig',
    component: () => import('@/components/views/sysConfig/RoleConfig.vue'),
    meta: {
      title: 'pageTitle.roleConfig',
      requireAuth: true
    }
  }, {
    path: '/user-config',
    name: 'userConfig',
    component: () => import('@/components/views/sysConfig/UserConfig.vue'),
    meta: {
      title: 'pageTitle.userConfig',
      requireAuth: true
    }
  }, {
    path: '/workflow-deploy',
    name: '/workflowDeploy',
    component: () => import('@/components/views/sysConfig/WorkflowDeploy.vue'),
    meta: {
      title: 'pageTitle.workflowDeploy',
      requireAuth: true
    }
  }]
}, {
  path: '*',
  name: '404',
  redirect: '/404'
}]
