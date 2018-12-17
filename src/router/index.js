import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '../store'

Vue.use(Router)
const router = new Router({
  routes,
  mode: 'history'
})
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (!store.state.app.userInfo.token) {
      router.replace({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  }
  document.title = store.state.app.appInfo.appName
  next()
})
export default router
