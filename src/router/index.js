import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '../store'
import iView from 'iview'

Vue.use(Router)
const router = new Router({
  mode: 'history',
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
  iView.LoadingBar.start()
  if (to.matched.length === 0) {
    router.push('/404')
  } else {
    if (to.meta.requireAuth) {
      if (!store.state.app.user.token) {
        store.commit('LOGIN_OUT')
        router.replace({
          name: 'login',
          params: { redirect: to.fullPath }
        })
      }
    }
    next()
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
  iView.LoadingBar.finish()
})
export default router
