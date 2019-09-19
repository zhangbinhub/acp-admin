import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '../store'

Vue.use(Router)
const router = new Router({
  mode: 'history',
  base: '/admin',
  routes: routes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})
router.beforeEach((to, from, next) => {
  if (to.matched.length === 0) {
    router.replace({
      name: 'E404',
      params: { redirect: from.fullPath }
    })
  } else {
    if (to.name === 'E404' && !to.params.redirect) {
      router.replace({
        name: 'E404',
        params: { redirect: from.fullPath }
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
      next()
    }
  }
})
router.afterEach(to => {
  let pageTitle = ''
  if (to.params.pageName) {
    pageTitle = ' - ' + to.params.pageName
  } else if (to.meta.title) {
    pageTitle = ' - ' + store.state.app.i18n.t(to.meta.title)
  }
  document.title = store.state.app.appInfo.appName + pageTitle
})
export default router
