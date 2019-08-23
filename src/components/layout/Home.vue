<template>
  <Layout style="height: 100%" :class="`home home-${theme}`">
    <Sider :hide-trigger="true" :collapsible="true" :width="220" :collapsed-width="63" v-model="isCollapsed"
           class="left-sider" :style="{overflow: 'hidden'}">
      <side-menu :accordion="true" ref="sideMenu" :active-name="fullPath" :collapsed="isCollapsed"
                 @on-select="handleClick" :menu-list="menuList" :open-names="openedNames" :theme="theme">
        <div class="logo-con">
          <img v-show="!isCollapsed" :src="mainLogo" alt=""/>
          <img v-show="isCollapsed" :src="minLogo" alt=""/>
        </div>
      </side-menu>
    </Sider>
    <Layout>
      <Header class="header-con">
        <header-bar :collapsed="isCollapsed" :full-path="fullPath" :menu-list="menuList"
                    :mini="isMini" @on-coll-change="handleCollapsedChange">
          <user :user-avator="userAvator" :customer-name="userName"/>
          <language style="margin-right: 10px;" :lang="localLang"/>
          <logFileButton v-if="showLogFile" style="margin-right: 10px;"></logFileButton>
          <configCenterButton v-if="showConfigCenter" style="margin-right: 10px;"></configCenterButton>
          <routeLogButton v-if="showRouteLog" style="margin-right: 10px;"></routeLogButton>
          <routeConfigButton v-if="showRouteConfig" style="margin-right: 10px;"></routeConfigButton>
          <fullscreen v-model="isFullscreen" style="margin-right: 10px;"/>
        </header-bar>
      </Header>
      <div class="home-content-con">
        <Layout class="home-layout-con">
          <div class="tag-nav-wrapper">
            <tags-nav :full-path="fullPath" :menu-list="menuList" :list="tagNavList"
                      @input="handleClick" @on-close="handleCloseTag"/>
          </div>
          <div class="content-wrapper">
            <div class="content-sticker">
              <transition name="fade" mode="out-in" :appear="true">
                <keep-alive :include="cacheList">
                  <router-view/>
                </keep-alive>
              </transition>
              <ABackTop :height="100" :bottom="80" :right="50" container=".content-wrapper"></ABackTop>
            </div>
            <Footer class="content-footer">
              <small style="text-align: center;">{{copyright}}</small>
            </Footer>
          </div>
        </Layout>
      </div>
    </Layout>
  </Layout>
</template>
<script>
    import SideMenu from './side-menu'
    import HeaderBar from './header-bar'
    import TagsNav from './tags-nav'
    import User from './user'
    import ABackTop from './a-back-top'
    import Fullscreen from './fullscreen'
    import Language from './language'
    import logFileButton from './log-file-button'
    import configCenterButton from './config-center-button'
    import routeConfigButton from './route-config-button'
    import routeLogButton from './route-log-button'
    import './Home.less'
    import {
        getOpenedNamesByActiveName,
        getTagNavListFromLocalstorage,
        setTagNavListInLocalstorage,
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
            ABackTop,
            routeConfigButton,
            configCenterButton,
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
            showRouteConfig () {
                return this.$store.state.app.user.userInfo.levels <= 0
            },
            showRouteLog () {
                return this.$store.state.app.user.userInfo.levels <= 0
            },
            showConfigCenter () {
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
            userAvator () {
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
                const routeList = this.$router.options.routes
                    .filter(item => item.name === 'home')
                    .flatMap(item => item.children)
                    .filter(item => !item.meta.notCache)
                    .map(item => item.name)
                this.$store.commit('SET_CACHE_LIST', routeList)

                // 初始化标签导航列表
                let tagNavList = getTagNavListFromLocalstorage()
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
                        setTagNavListInLocalstorage(newTagNavList)
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
                        setTagNavListInLocalstorage(tagList)
                        this.$store.commit('SET_TAG_NAV_LIST', tagList)
                        callBackFunc(true)
                    }, this.$i18n.t('messages.allPages'), true)
                } else if (type === 'others') {
                    this.$api.turnToPage(this.fullPath, (callBackFunc) => {
                        setTagNavListInLocalstorage(tagList)
                        this.$store.commit('SET_TAG_NAV_LIST', tagList)
                        callBackFunc(true)
                    }, this.$i18n.t('messages.otherPages'), true)
                } else if (type !== 'others' && this.fullPath !== nextPath) {
                    this.$api.turnToPage(nextPath, (callBackFunc) => {
                        setTagNavListInLocalstorage(tagList)
                        this.$store.commit('SET_TAG_NAV_LIST', tagList)
                        callBackFunc(true)
                    }, pageName)
                } else {
                    setTagNavListInLocalstorage(tagList)
                    this.$store.commit('SET_TAG_NAV_LIST', tagList)
                }
            },
            handleClick (path) {
                this.$api.turnToPage(path)
            }
        }
    }
</script>
