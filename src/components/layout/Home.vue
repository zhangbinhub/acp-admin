<template>
  <Layout style="height: 100%" class="home">
    <Sider hide-trigger collapsible :width="220" :collapsed-width="64" v-model="isCollapsed" class="left-sider"
           :style="{overflow: 'hidden'}">
      <side-menu :accordion="true" ref="sideMenu" :active-name="$router.currentRoute.fullPath" :collapsed="isCollapsed"
                 @on-select="turnToPage"
                 :menu-list="menuList" :open-names="openedNames" :theme="menuTheme">
        <div :class="`logo-con logo-con-${menuTheme}`">
          <img v-show="!isCollapsed" :src="mianLogo" alt=""/>
          <img v-show="isCollapsed" :src="minLogo" alt=""/>
        </div>
      </side-menu>
    </Sider>
    <Layout>
      <Header class="header-con">
        <header-bar :collapsed="isCollapsed" @on-coll-change="handleCollapsedChange">
          <user :user-avator="userAvator" :customer-name="userName"/>
          <language style="margin-right: 10px;" :lang="localLang"/>
          <fullscreen v-model="isFullscreen" style="margin-right: 10px;"/>
        </header-bar>
      </Header>
      <Content class="home-content-con">
        <Layout class="home-layout-con">
          <div class="tag-nav-wrapper">
            <tags-nav :value="$route" @input="handleClick" :list="tagNavList" @on-close="handleCloseTag"/>
          </div>
          <Content class="content-wrapper">
            <keep-alive :include="cacheList">
              <router-view/>
            </keep-alive>
            <ABackTop :height="100" :bottom="80" :right="50" container=".content-wrapper"></ABackTop>
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
  import minLogo from '@/assets/images/logo/logo.png'
  import maxLogoDark from '@/assets/images/logo/logo-main-dark.png'
  import maxLogoLight from '@/assets/images/logo/logo-main-light.png'

  import './Home.less'
  import { getOpenedNamesByActiveName, findMenuByPath } from '@/libs/tools'

  export default {
    name: 'Home',
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
        openedNames: [],
        minLogo,
        isFullscreen: false
      }
    },
    created () {
      // TODO: 获取用户信息
      this.$api.request.getMenus().then((res) => {
        if (res && !res.data.error_description) {
          this.$store.commit('SET_MENU_LIST', res.data)
          this.openedNames = getOpenedNamesByActiveName(this.$router.currentRoute.fullPath, this)
        }
      })
    },
    computed: {
      menuTheme () {
        return this.$store.state.app.appInfo.menuTheme
      },
      isCollapsed () {
        return !this.$store.state.app.sidebar.opened
      },
      mianLogo () {
        return this.$store.state.app.appInfo.menuTheme === 'dark' ? maxLogoDark : maxLogoLight
      },
      tagNavList () {
        return this.$store.state.app.tagNavList
      },
      tagRouter () {
        return this.$store.state.app.tagRouter
      },
      userAvator () {
        return this.$store.state.app.userInfo.avatorImg
      },
      userName () {
        return this.$store.state.app.userInfo.customerName
      },
      cacheList () {
        // TODO
        // return ['ParentView', ...this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []]
        return []
      },
      menuList () {
        return this.$store.state.app.userInfo.menuList
      },
      localLang () {
        return this.$store.state.app.lang.lang
      }
    },
    methods: {
      // stirng | route
      turnToPage (obj) {
        let { name, params, query } = { name: '' }
        if (typeof obj === 'string') { // string
          name = obj
        } else { // route
          name = obj.name
          params = obj.params
          query = obj.query
        }
        if (name.startsWith('/') || name.toLowerCase().startsWith('http')) {
          const menu = findMenuByPath(name, this.$store.state.app.userInfo.menuList)
          switch (menu.opentype) {
            case 0: // 内嵌模式
              this.$router.push(menu.path)
              break
            case 1: // 对话框模式
              // TODO: 对话框中打开页面
              break
            case 2: // 打开新页面
              window.open(menu.path)
              break
            default:
              this.$router.push(menu.path)
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
      handleCloseTag (res, type, route) {
        // TODO
        // if (type === 'all') {
        //   this.turnToPage(this.$config.homeName)
        // } else if (routeEqual(this.$route, route)) {
        //   if (type !== 'others') {
        //     const nextRoute = getNextRoute(this.tagNavList, route)
        //     this.$router.push(nextRoute)
        //   }
        // }
        // this.setTagNavList(res)
      },
      handleClick (item) {
        this.turnToPage(item)
      }
    },
    mounted () {
      /**
       * @description 初始化设置面包屑导航和标签导航
       */
      // TODO
      // this.setTagNavList()
      // this.setHomeRoute(routers)
      // this.addTag({
      //   route: this.$store.state.app.homeRoute
      // })
      // this.setBreadCrumb(this.$route)
      // // 设置初始语言
      // this.setLocal(this.$i18n.locale)
      // 如果当前打开页面不在标签栏中，跳到homeName页
      // if (!this.tagNavList.find(item => item.name === this.$route.name)) {
      //   this.$router.push({
      //     name: this.$config.homeName
      //   })
      // }
    }
  }
</script>
