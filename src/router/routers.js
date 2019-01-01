export default [
  {
    path: '/test',
    name: 'test',
    component: () => import('@/components/test/test.vue'),
    meta: {
      title: 'pageTitle.test'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/components/pages/Login.vue'),
    meta: {
      title: 'pageTitle.login'
    }
  },
  {
    path: '/404',
    name: 'E404',
    component: () => import('@/components/pages/E404.vue'),
    meta: {
      title: 'pageTitle.E404'
    }
  },
  {
    path: '/500',
    name: 'E500',
    component: () => import('@/components/pages/E500.vue'),
    meta: {
      title: 'pageTitle.E500'
    }
  },
  {
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
    }, {
      path: '/demo4',
      name: 'demo4',
      component: () => import('@/components/views/Demo4.vue'),
      meta: {
        notCache: true,
        requireAuth: true
      }
    }]
  },
  {
    path: '*',
    name: '404',
    redirect: '/404'
  }
]
