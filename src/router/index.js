import {createRouter, createWebHistory} from 'vue-router'
import routes from './routers'
import store from '@/store'
import NProgress from 'nprogress'

const router = createRouter({
  history: createWebHistory(store.state.app.appInfo.routeBase),
  routes: routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {x: 0, y: 0}
    }
  }
})
router.beforeEach((to, from) => {
  NProgress.start()
  if (to.matched.length === 0) {
    router.replace({
      name: 'E404',
      params: {redirect: from.fullPath}
    })
  } else {
    if (to.name === 'E404' && !to.params.redirect) {
      router.replace({
        name: 'E404',
        params: {redirect: from.fullPath}
      })
    } else {
      if (to.meta.requireAuth) {
        if (!store.state.app.user.token) {
          store.commit('LOGIN_OUT')
          store.commit('SET_TAG_NAV_LIST', [])
          router.replace({
            name: 'login'
          })
        }
      }
    }
  }
})
router.afterEach(to => {
  NProgress.done()
  let pageTitle = ''
  if (to.params.pageName) {
    pageTitle = ' - ' + to.params.pageName
  } else if (to.meta.title) {
    pageTitle = ' - ' + store.state.app.i18n.global.t(to.meta.title)
  }
  document.title = store.state.app.appInfo.appName + pageTitle
})
export default router
