<template>
  <Layout style="height: 100%" class="home">
    <Sider hide-trigger collapsible :width="220" :collapsed-width="64" v-model="isCollapsed" class="left-sider"
           :style="{overflow: 'hidden'}">
      <side-menu :accordion="true" ref="sideMenu" :active-name="$route.name" :collapsed="isCollapsed"
                 @on-select="turnToPage"
                 :menu-list="menuList" :open-names="openedNames" :theme="menuTheme">
        <div :class="`logo-con logo-con-${menuTheme}`">
          <img v-show="!isCollapsed" :src="maxLogo" alt=""/>
          <img v-show="isCollapsed" :src="minLogo" alt=""/>
        </div>
      </side-menu>
    </Sider>
    <Layout>
      <Header class="header-con">
        <header-bar :collapsed="isCollapsed" @on-coll-change="handleCollapsedChange">
          <user :user-avator="userAvator"/>
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
  import minLogo from '@/assets/images/logo/logo-main-min.jpg'
  import maxLogo from '@/assets/images/logo/logo-main.jpg'
  import './Home.less'
  import { getOpenedNamesByActiveName } from '@/libs/tools'

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
        maxLogo,
        isFullscreen: false
      }
    },
    created () {
      this.$api.request.getMenus().then((res) => {
        if (res && !res.data.error_description) {
          this.$store.commit('SET_MENU_LIST', res.data)
          this.openedNames = getOpenedNamesByActiveName(this.$route.name, this)
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
      tagNavList () {
        return this.$store.state.app.tagNavList
      },
      tagRouter () {
        return this.$store.state.app.tagRouter
      },
      userAvator () {
        // return this.$store.state.user.avatorImgPath
        return ''
      },
      cacheList () {
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
      turnToPage (route) {
        let { name, params, query } = {}
        if (typeof route === 'string') {
          name = route
        } else {
          name = route.name
          params = route.params
          query = route.query
        }
        if (name.indexOf('isTurnByHref_') > -1) {
          window.open(name.split('_')[1])
          return
        }
        this.$router.push({
          name,
          params,
          query
        })
      },
      handleCollapsedChange (state) {
        if (state) {
          this.$store.commit('CLOSE_SLIDEBAR')
        } else {
          this.$store.commit('OPEN_SLIDEBAR')
        }
      },
      handleCloseTag (res, type, route) {
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
    watch: {
      '$route' (newRoute) {
        const { name, query, params, meta } = newRoute
        // this.addTag({
        //   route: { name, query, params, meta },
        //   type: 'push'
        // })
        // this.setBreadCrumb(newRoute)
        // this.setTagNavList(getNewTagList(this.tagNavList, newRoute))
        this.$refs.sideMenu.updateOpenName(newRoute.name)
      }
    },
    mounted () {
      /**
       * @description 初始化设置面包屑导航和标签导航
       */
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
