<template>
  <div class="header-tabs">
    <div class="close-con">
      <el-dropdown trigger="click" @command="handleTagsOption">
        <el-button type="text" size="small" style="padding-top: 6px">
          <el-icon size="18">
            <el-icon-circle-close-filled/>
          </el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="close-others">{{ $t('home.closeOther') }}</el-dropdown-item>
            <el-dropdown-item command="close-all">{{ $t('home.closeAll') }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <el-tabs type="card" ref="header-tabs" v-model="currPath"
             :before-leave="handleBeforeLeave"
             @tab-remove="handleClose"
             @tab-click="handleClick">
      <el-tab-pane
        v-for="(item,index) in tagList"
        :key="item.path+'-'+index"
        :label="showTitleInside(item)"
        :name="item.path"
        :data-route-name="item.routeName"
        :data-route-query="JSON.stringify(item.routeQuery)"
        :data-route-params="JSON.stringify(item.routeParams)"
        :closable="!item.isHome">
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {nextTick} from 'vue'
import {copy} from '@/libs/tools'
import './tags-nav.less'

export default {
  name: 'TagsNav',
  props: {
    modelValue: Object,
    list: {
      type: Array,
      default() {
        return []
      }
    },
    menuList: {
      type: Array,
      default: () => []
    },
    fullPath: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      tagBodyLeft: 0,
      rightOffset: 40,
      outerPadding: 4,
      contextMenuLeft: 0,
      contextMenuTop: 0,
      visible: false,
      homePath: this.$store.state.app.appInfo.homePath,
      currPath: this.fullPath
    }
  },
  computed: {
    tagList() {
      return this.list
    }
  },
  methods: {
    handleTagsOption(type) {
      if (type.includes('all')) {
        const res = this.list.filter(item => item.path === this.homePath)
        this.$emit('on-close', res, 'all')
      } else if (type.includes('others')) {
        const res = this.list.filter(item => item.path === this.fullPath || item.path === this.homePath)
        this.$emit('on-close', res, 'others')
        this.focusTagElementByFullPath(this.fullPath)
      }
    },
    handleClose(path) {
      this.close(path)
    },
    close(path) {
      const res = this.list.filter(item => item.path !== path)
      const currIndex = this.list.findIndex(item => item.path === path)
      const currTag = this.list.filter(item => item.path === path)[0]
      const pageName = this.showTitleInside(currTag)
      let nextPath = this.homePath
      if (path === this.$route.fullPath) {
        if (currIndex === this.list.length - 1) {
          nextPath = this.list[this.list.length - 2].path
        } else {
          nextPath = this.list[currIndex + 1].path
        }
      } else {
        nextPath = this.$route.fullPath
      }
      this.$emit('on-close', res, undefined, nextPath, pageName)
    },
    handleBeforeLeave(path) {
      return this.$route.fullPath === path
    },
    handleClick(tab) {
      this.$emit('update:modelValue', {
        name: tab.instance.attrs['data-route-name'],
        query: JSON.parse(tab.instance.attrs['data-route-query']),
        params: JSON.parse(tab.instance.attrs['data-route-params'])
      })
    },
    showTitleInside(item) {
      if (item.isHome) {
        return this.$i18n.t('pageTitle.home')
      } else {
        if (item.name) {
          return item.name
        } else if (item.meta.title) {
          return this.$i18n.t(item.meta.title)
        } else {
          return item.routeName
        }
      }
    },
    focusTagElementByFullPath(fullPath) {
      nextTick(() => {
        this.currPath = fullPath
      })
    },
    closeMenu() {
      this.visible = false
    }
  },
  watch: {
    '$route': {
      immediate: true,
      handler(to) {
        nextTick(() => {
          let newTagNavList = copy(this.tagList)
          newTagNavList.forEach((item) => {
            if (item.path === to.fullPath) {
              item.routeQuery = to.query
              item.routeParams = to.params
            }
          })
          this.$store.commit('SET_TAG_NAV_LIST', newTagNavList)
          this.focusTagElementByFullPath(to.fullPath)
        })
      }
    },
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  }
}
</script>
