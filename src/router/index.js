import {createRouter, createWebHashHistory} from 'vue-router'
import routes from './routers'
import store from '@/store'
import NProgress from 'nprogress'
import {buildRouteParams, getRouteParams} from "@/libs/tools";

const router = createRouter({
  history: createWebHashHistory(store.state.app.appInfo.routeBase),
  routes: routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {left: 0, top: 0}
    }
  }
})
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (to.matched.length === 0) {
    next({
      name: 'E404',
      params: buildRouteParams({redirect: from.fullPath})
    })
  } else {
    if (to.meta.requireAuth && !store.state.app.user.token) {
      store.commit('LOGIN_OUT')
      store.commit('SET_TAG_NAV_LIST', [])
      next({
        name: 'login'
      })
    } else {
      next()
    }
  }
})
router.afterEach(to => {
  NProgress.done()
  const params = getRouteParams(to)
  let pageTitle = ''
  if (params.pageName) {
    pageTitle = ' - ' + params.pageName
  } else if (to.meta.title) {
    pageTitle = ' - ' + store.state.app.i18n.global.t(to.meta.title)
  }
  document.title = store.state.app.appInfo.appName + pageTitle
})
export default router
