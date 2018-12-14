export default [
  {
    path: '/test',
    name: 'test',
    component: () => import('@/components/test/test.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/components/pages/Login.vue')
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/components/pages/E404.vue')
  },
  {
    path: '/500',
    name: '500',
    component: () => import('@/components/pages/E500.vue')
  },
  {
    path: '/',
    name: 'home',
    component: () => import('@/components/views/Home.vue'),
    children: []
  },
  {
    path: '*',
    redirect: '/404'
  }
]
