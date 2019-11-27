<template>
  <el-container style="height: 100%" :class="`home home-${theme}`">
    <el-aside width="auto" :style="{overflow: 'hidden'}">
      <side-menu :accordion="true" :active-name="fullPath" :collapsed="isCollapsed"
                 @on-select="handleClick" :menu-list="menuList" :open-names="openedNames" :theme="theme"
                 :class="{'menu-container':true,'collapsed':isCollapsed}">
        <div :class="{'logo-con':true,'collapsed':isCollapsed}">
          <img v-show="!isCollapsed" :src="mainLogo" alt=""/>
          <img v-show="isCollapsed" :src="minLogo" alt=""/>
        </div>
      </side-menu>
    </el-aside>
    <el-container style="width: 100%">
      <el-header style="padding: 0;height: 60px">
        <header-bar :collapsed="isCollapsed" :full-path="fullPath" :menu-list="menuList"
                    :mini="isMini" @on-coll-change="handleCollapsedChange">
          <user :user-avatar="userAvatar" :customer-name="userName"/>
          <language :lang="localLang"/>
          <logFileButton v-if="showLogFile"/>
          <routeLogButton v-if="showRouteLog"/>
          <routeConfigButton v-if="showRouteConfig"/>
          <fullscreen v-model="isFullscreen"/>
        </header-bar>
      </el-header>
      <el-container>
        <el-header style="padding: 0;height: 33px">
          <tags-nav :full-path="fullPath" :menu-list="menuList" :list="tagNavList"
                    @input="handleClick" @on-close="handleCloseTag"/>
        </el-header>
        <el-scrollbar ref="main-scrollbar" class="main-scrollbar" :style="{height:mainHeight+'px'}">
          <el-main class="main-content">
            <transition name="fade-transform" mode="out-in" :appear="true">
              <keep-alive :include="cacheList">
                <router-view/>
              </keep-alive>
            </transition>
          </el-main>
          <el-backtop :visibility-height="100" target=".main-scrollbar .el-scrollbar__wrap"/>
        </el-scrollbar>
      </el-container>
      <el-footer class="foot-content" style="height: 30px">
        <small style="text-align: center;">{{copyright}}</small>
      </el-footer>
    </el-container>
  </el-container>
</template>
<script>
  import SideMenu from './side-menu'
  import HeaderBar from './header-bar'
  import TagsNav from './tags-nav'
  import User from './user'
  import Fullscreen from './fullscreen'
  import Language from './language'
  import logFileButton from './log-file-button'
  import routeConfigButton from './route-config-button'
  import routeLogButton from './route-log-button'
  import './Home.less'
  import {
    getOpenedNamesByActiveName,
    updateTagNavList
  } from '@/libs/tools'

  export default {
    name: 'home',
    components: {
      SideMenu,
      HeaderBar,
      Language,
      TagsNav,
      Fullscreen,
      User,
      routeConfigButton,
      logFileButton,
      routeLogButton
    },
    data () {
      return {
        copyright: this.$store.state.app.appInfo.copyright,
        openedNames: [],
        isFullscreen: false,
        homePath: this.$store.state.app.appInfo.homePath
      }
    },
    created () {
      // 向服务端请求数据并初始化到本地
      this.initRemoteData()
      // 本地初始化数据
      this.initStoreData()
    },
    computed: {
      mainHeight () {
        return this.$store.state.app.mainHeight
      },
      showRouteConfig () {
        return this.$store.state.app.user.userInfo.levels <= 0
      },
      showRouteLog () {
        return this.$store.state.app.user.userInfo.levels <= 0
      },
      showLogFile () {
        return this.$store.state.app.user.userInfo.levels <= 0
      },
      theme () {
        return this.$store.state.app.appInfo.theme
      },
      fullPath () {
        return this.$route.fullPath
      },
      isCollapsed () {
        return !this.$store.state.app.sidebar.opened
      },
      isMini () {
        return this.$store.state.app.isMini
      },
      minLogo () {
        return require('@/assets/images/logo/logo.png')
      },
      mainLogo () {
        return require('@/assets/images/logo/logo-main-' + this.$store.state.app.appInfo.theme + '.png')
      },
      tagNavList () {
        return this.$store.state.app.tagNavList
      },
      userAvatar () {
        return this.$store.state.app.user.userInfo.avatar
      },
      userName () {
        return this.$store.state.app.user.userInfo.name
      },
      cacheList () {
        return this.$store.state.app.cacheList
      },
      menuList () {
        return this.$store.state.app.user.menuList
      },
      localLang () {
        return this.$store.state.app.lang.lang
      }
    },
    watch: {
      '$route' (newRoute) {
        this.updateTagList(this.tagNavList, this.menuList, newRoute)
      },
      mainHeight () {
        this.$nextTick(() => {
          this.$refs['main-scrollbar'].update()
        })
      }
    },
    methods: {
      initRemoteData () {
        // 获取用户信息
        this.$api.request.auth.getUserInfo().then((res) => {
          if (res && !res.data.errorDescription) {
            this.$store.commit('SET_USER_INFO', res.data)
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
      initStoreData () {
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
            path: this.homePath
          })
        }
        this.$store.commit('SET_TAG_NAV_LIST', tagNavList)
      },
      updateTagList (tagNavList, menuList, route) {
        if (route.name !== 'E404' && route.name !== 'E500') {
          const newTagNavList = updateTagNavList(tagNavList, menuList, route)
          if (newTagNavList && newTagNavList.length > 0) {
            this.$store.commit('SET_TAG_NAV_LIST', newTagNavList)
          }
        }
      },
      handleCollapsedChange (state) {
        if (state) {
          this.$store.commit('CLOSE_SLIDEBAR')
        } else {
          this.$store.commit('OPEN_SLIDEBAR')
        }
      },
      handleCloseTag (tagList, type, nextPath, pageName) {
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
      handleClick (path) {
        this.$api.turnToPage(path)
      }
    }
  }
</script>
