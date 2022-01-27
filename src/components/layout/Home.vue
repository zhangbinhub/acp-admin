<template>
  <el-config-provider :locale="localLangMessage">
    <el-container :class="`home home-${theme}`">
      <el-header>
        <header-bar :full-path="fullPath" :menu-list="menuList" :mini="isMini" :is-mobile="isMobile">
          <user :user-avatar="userAvatar" :customer-name="userName"/>
        </header-bar>
      </el-header>
      <el-container class="home-content">
        <el-aside v-show="!isMobile">
          <side-menu :accordion="true" :active-name="fullPath" :collapsed="isCollapsed" :is-mobile="isMobile"
                     @on-select="handleClick" :menu-list="menuList" :open-names="openedNames"
                     :theme="theme" :class="{'menu-container':true,'collapsed':isCollapsed}"/>
        </el-aside>
        <el-container :class="{mobile:isMobile}">
          <el-header>
            <tags-nav :full-path="fullPath" :menu-list="menuList" :list="tagNavList" v-show="!isMobile"
                      @update:modelValue="handleClick" @on-close="handleCloseTag"/>
            <side-menu :accordion="true" :active-name="fullPath" :collapsed="isCollapsed" v-show="isMobile"
                       :is-mobile="isMobile" @on-select="handleClick" :menu-list="menuList" :open-names="openedNames"
                       :theme="theme"/>
          </el-header>
          <el-scrollbar ref="mainScrollbar" class="main-scrollbar">
            <el-main class="main-content">
              <router-view v-slot="{ Component }">
                <transition name="el-fade-in" mode="out-in" appear>
                  <keep-alive :include="cacheList">
                    <component :is="Component"/>
                  </keep-alive>
                </transition>
              </router-view>
            </el-main>
            <el-backtop :visibility-height="100" target=".main-scrollbar .el-scrollbar__wrap"/>
          </el-scrollbar>
          <el-footer class="foot-content">
            <small style="text-align: center;">{{ copyright }}</small>
          </el-footer>
        </el-container>
      </el-container>
    </el-container>
  </el-config-provider>
</template>
<script>
import {nextTick, ref} from 'vue'
import SideMenu from './side-menu'
import HeaderBar from './header-bar'
import TagsNav from './tags-nav'
import User from './user'
import './Home.less'
import {
  getOpenedNamesByActiveName, isMobileDevice,
  updateTagNavList
} from '@/libs/tools'

export default {
  name: 'home',
  components: {
    SideMenu,
    HeaderBar,
    TagsNav,
    User
  },
  data() {
    return {
      copyright: this.$store.state.app.appInfo.copyright,
      openedNames: [],
      homePath: this.$store.state.app.appInfo.homePath
    }
  },
  created() {
    // 向服务端请求数据并初始化到本地
    this.initRemoteData()
    // 本地初始化数据
    this.initStoreData()
  },
  computed: {
    theme() {
      return this.$store.state.app.appInfo.theme
    },
    fullPath() {
      return this.$route.fullPath
    },
    isCollapsed() {
      return !this.$store.state.app.sidebar.opened
    },
    isMini() {
      return this.$store.state.app.isMini
    },
    isMobile() {
      return isMobileDevice()
    },
    tagNavList() {
      return this.$store.state.app.tagNavList
    },
    userAvatar() {
      return this.$store.state.app.user.userInfo.avatar
    },
    userName() {
      return this.$store.state.app.user.userInfo.name
    },
    cacheList() {
      return this.$store.state.app.cacheList
    },
    menuList() {
      return this.$store.state.app.user.menuList
    },
    localLangMessage() {
      return this.$store.state.app.lang.langMessages[this.$store.state.app.lang.lang]
    }
  },
  watch: {
    '$route'(newRoute) {
      this.updateTagList(this.tagNavList, this.menuList, newRoute)
    },
    mainHeight() {
      nextTick(() => {
        this.mainScrollbar.update()
      })
    }
  },
  methods: {
    initRemoteData() {
      // 获取用户信息
      this.$api.request.auth.getUserInfo().then((res) => {
        if (res && !res.data.errorDescription) {
          this.$store.commit('SET_USER_INFO', res.data)
          if (res.data.passwordExpire) {
            this.$api.turnToPage({
              name: 'passwordExpire'
            })
          }
        }
      })
      // 获取菜单信息
      this.$api.request.auth.getMenus().then((res) => {
        if (res && !res.data.errorDescription) {
          this.$store.commit('SET_MENU_LIST', res.data)
          this.openedNames = getOpenedNamesByActiveName(this.fullPath, this)
          this.updateTagList(this.$store.state.app.tagNavList, this.menuList, this.$route)
        }
      })
    },
    initStoreData() {
      // 初始化主页子路由缓存列表
      let routeList = []
      this.$router.options.routes
        .filter(item => item.name === 'home')
        .forEach(item => {
          routeList.push(...item.children)
        })
      routeList = routeList.filter(item => !item.meta.notCache)
        .map(item => item.name)
      this.$store.commit('SET_CACHE_LIST', routeList)

      // 初始化标签导航列表
      let tagNavList = this.$store.state.app.tagNavList
      if (tagNavList.length === 0) {
        tagNavList.push({
          isHome: true,
          path: this.homePath,
          routeName: this.homePath.substring(1),
          routeQuery: {},
          routeParams: {}
        })
      }
      this.$store.commit('SET_TAG_NAV_LIST', tagNavList)
    },
    updateTagList(tagNavList, menuList, route) {
      if (route.name !== 'login' && route.name !== 'E404' && route.name !== 'E500' && route.name !== 'passwordExpire') {
        const newTagNavList = updateTagNavList(tagNavList, menuList, route)
        if (newTagNavList && newTagNavList.length > 0) {
          this.$store.commit('SET_TAG_NAV_LIST', newTagNavList)
        }
      }
    },
    handleCloseTag(tagList, type, nextPath, pageName) {
      if (type === 'all') {
        this.$api.turnToPage(this.homePath, (callBackFunc) => {
          this.$store.commit('SET_TAG_NAV_LIST', tagList)
          callBackFunc(true)
        }, this.$i18n.t('messages.allPages'), true)
      } else if (type === 'others') {
        this.$api.turnToPage(this.fullPath, (callBackFunc) => {
          this.$store.commit('SET_TAG_NAV_LIST', tagList)
          callBackFunc(true)
        }, this.$i18n.t('messages.otherPages'), true)
      } else if (type !== 'others' && this.fullPath !== nextPath) {
        this.$api.turnToPage(nextPath, (callBackFunc) => {
          this.$store.commit('SET_TAG_NAV_LIST', tagList)
          callBackFunc(true)
        }, pageName)
      } else {
        this.$store.commit('SET_TAG_NAV_LIST', tagList)
      }
    },
    handleClick(obj) {
      this.$api.turnToPage(obj)
    }
  },
  setup() {
    const mainScrollbar = ref(null)
    return {mainScrollbar}
  }
}
</script>
