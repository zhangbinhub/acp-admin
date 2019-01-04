<template>
  <Layout style="height: 100%" :class="`home home-${theme}`">
    <Sider hide-trigger collapsible :width="220" :collapsed-width="63" v-model="isCollapsed" class="left-sider"
           :style="{overflow: 'hidden'}">
      <side-menu :accordion="true" ref="sideMenu" :active-name="fullPath" :collapsed="isCollapsed"
                 @on-select="gotoPage" :menu-list="menuList" :open-names="openedNames" :theme="theme">
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
          <fullscreen v-model="isFullscreen" style="margin-right: 10px;"/>
        </header-bar>
      </Header>
      <Content class="home-content-con">
        <Layout class="home-layout-con">
          <div class="tag-nav-wrapper">
            <tags-nav :full-path="fullPath" :menu-list="menuList" :list="tagNavList"
                      @input="handleClick" @on-close="handleCloseTag"/>
          </div>
          <Content class="content-wrapper">
            <div class="content-sticker">
              <keep-alive :include="cacheList">
                <router-view/>
              </keep-alive>
              <ABackTop :height="100" :bottom="80" :right="50" container=".content-wrapper"></ABackTop>
            </div>
            <Footer class="content-footer">
              <small style="text-align: center;">{{copyright}}</small>
            </Footer>
          </Content>
        </Layout>
      </Content>
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

  import './Home.less'
  import {
    getOpenedNamesByActiveName,
    findMenuByPath,
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
      ABackTop
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
        return this.$store.state.app.user.userInfo.portrait
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
        this.$api.request.getUserInfo().then((res) => {
          if (res && !res.data.error_description) {
            this.$store.commit('SET_USER_INFO', res.data)
          }
        }).catch((error) => {
            this.$api.errorProcess(error)
          }
        )
        // 获取菜单信息
        this.$api.request.getMenus().then((res) => {
          if (res && !res.data.error_description) {
            this.$store.commit('SET_MENU_LIST', res.data)
            this.openedNames = getOpenedNamesByActiveName(this.fullPath, this)
            this.updateTagList(this.$store.state.app.tagNavList, this.menuList, this.$route)
          }
        }).catch((error) => {
            this.$api.errorProcess(error)
          }
        )
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
        const newTagNavList = updateTagNavList(tagNavList, menuList, route)
        if (newTagNavList && newTagNavList.length > 0) {
          setTagNavListInLocalstorage(newTagNavList)
          this.$store.commit('SET_TAG_NAV_LIST', newTagNavList)
        }
      },
      /**
       * 标签页面跳转
       * @param obj 跳转参数 stirng | route
       * @param beforeTurnFunc 跳转前执行的函数
       * @param pageName 页面名称
       * @param closeMore 是否关闭多个页面
       */
      turnToPage (obj, beforeTurnFunc, pageName, closeMore = false) {
        let path = ''
        if (typeof obj === 'string') { // string
          path = obj
        } else { // route
          path = obj.path
        }
        const menu = findMenuByPath(path, this.$store.state.app.user.menuList)
        let dataLose = false
        if (!closeMore) {
          if (this.$route.meta) {
            dataLose = this.$route.meta.withInput && this.$route.meta.notCache
          }
        } else {
          dataLose = true
        }
        if ((!menu || menu.opentype !== 1) && dataLose) {
          this.$Modal.confirm({
            title: this.$i18n.t('dialog.confirm'),
            content: '<br/><p style="color: red">' + pageName + '</p><br/>' +
              '<p>' + this.$i18n.t('messages.leavePage') + '</p>',
            onOk: () => {
              if (beforeTurnFunc && typeof beforeTurnFunc === 'function') {
                if (beforeTurnFunc()) {
                  this.gotoPage(obj)
                }
              } else {
                this.gotoPage(obj)
              }
            }
          })
          return false
        }
        if (beforeTurnFunc && typeof beforeTurnFunc === 'function') {
          if (beforeTurnFunc()) {
            this.gotoPage(obj)
          }
        } else {
          this.gotoPage(obj)
        }
      },
      gotoPage (obj) {
        let { name, params, query } = { name: '' }
        if (typeof obj === 'string') { // string
          name = obj
        } else { // route
          name = obj.name
          params = obj.params
          query = obj.query
        }
        if (name.startsWith('/') || name.toLowerCase().startsWith('http')) {
          const menu = findMenuByPath(name, this.$store.state.app.user.menuList)
          if (menu) {
            switch (menu.opentype) {
              case 0: // 内嵌模式
                this.$router.push(menu.path)
                break
              case 1: // 打开新页面
                window.open(menu.path)
                break
              default:
                this.$router.push(menu.path)
            }
          } else {
            this.$router.push(name)
          }
        } else {
          this.$router.push({
            name: name,
            params: params,
            query: query
          })
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
          this.turnToPage(this.homePath, () => {
            setTagNavListInLocalstorage(tagList)
            this.$store.commit('SET_TAG_NAV_LIST', tagList)
            return true
          }, this.$i18n.t('messages.allPages'), true)
        } else if (type === 'others') {
          this.turnToPage(this.fullPath, () => {
            setTagNavListInLocalstorage(tagList)
            this.$store.commit('SET_TAG_NAV_LIST', tagList)
            return true
          }, this.$i18n.t('messages.otherPages'), true)
        } else if (type !== 'others' && this.fullPath !== nextPath) {
          this.turnToPage(nextPath, () => {
            setTagNavListInLocalstorage(tagList)
            this.$store.commit('SET_TAG_NAV_LIST', tagList)
            return true
          }, pageName)
        } else {
          setTagNavListInLocalstorage(tagList)
          this.$store.commit('SET_TAG_NAV_LIST', tagList)
        }
      },
      handleClick (item) {
        this.gotoPage(item)
      }
    }
  }
</script>
