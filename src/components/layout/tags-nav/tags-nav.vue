<template>
  <div class="tags-nav">
    <div class="close-con">
      <Dropdown :transfer="true" @on-click="handleTagsOption" style="margin-top:7px;">
        <Button size="small" type="text">
          <Icon :size="18" type="ios-close-circle-outline"/>
        </Button>
        <DropdownMenu slot="list">
          <DropdownItem name="close-all">{{$t('home.closeAll')}}</DropdownItem>
          <DropdownItem name="close-others">{{$t('home.closeOther')}}</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
    <div class="btn-con left-btn">
      <Button type="text" @click="handleScroll(240)">
        <Icon :size="18" type="ios-arrow-back"/>
      </Button>
    </div>
    <ul v-show="visible" :style="{left: contextMenuLeft + 'px', top: contextMenuTop + 'px'}" class="contextmenu">
      <li v-for="(item, key) of contextMenuList" @click="handleTagsOption(key)" :key="key">{{item}}</li>
    </ul>
    <div class="btn-con right-btn">
      <Button type="text" @click="handleScroll(-240)">
        <Icon :size="18" type="ios-arrow-forward"/>
      </Button>
    </div>
    <div class="scroll-outer" ref="scrollOuter" @DOMMouseScroll="handleScrollMouse" @mousewheel="handleScrollMouse">
      <div ref="scrollBody" class="scroll-body" :style="{left: tagBodyLeft + 'px'}">
        <transition-group name="taglist-moving-animation">
          <Tag
            type="dot"
            v-for="(item, index) in tagList"
            ref="tagsPageOpened"
            :key="`tag-nav-${index}`"
            :name="item.path"
            :data-route-item="item"
            @on-close="handleClose(item)"
            @click.native="handleClick(item)"
            :closable="!item.isHome"
            :color="isCurrentTag(item) ? 'primary' : 'default'"
            @contextmenu.prevent.native="contextMenu(item, $event)"
          >{{ showTitleInside(item) }}
          </Tag>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: 'TagsNav',
        props: {
            value: Object,
            list: {
                type: Array,
                default () {
                    return []
                }
            },
            menuList: {
                type: Array,
                default: () => []
            },
            fullPath: String
        },
        data () {
            return {
                tagBodyLeft: 0,
                rightOffset: 40,
                outerPadding: 4,
                contextMenuLeft: 0,
                contextMenuTop: 0,
                visible: false,
                homePath: this.$store.state.app.appInfo.homePath
            }
        },
        computed: {
            tagList () {
                return this.list
            },
            contextMenuList () {
                return {
                    others: this.$i18n.t('home.closeOther'),
                    all: this.$i18n.t('home.closeAll')
                }
            }
        },
        methods: {
            handleScrollMouse (e) {
                const type = e.type
                let delta = 0
                if (type === 'DOMMouseScroll' || type === 'mousewheel') {
                    delta = (e.wheelDelta) ? e.wheelDelta : -(e.detail || 0) * 40
                }
                this.handleScroll(delta)
            },
            handleScroll (offset) {
                const outerWidth = this.$refs.scrollOuter.offsetWidth
                const bodyWidth = this.$refs.scrollBody.offsetWidth
                if (offset > 0) {
                    this.tagBodyLeft = Math.min(0, this.tagBodyLeft + offset)
                } else {
                    if (outerWidth < bodyWidth) {
                        if (this.tagBodyLeft >= -(bodyWidth - outerWidth)) {
                            this.tagBodyLeft = Math.max(this.tagBodyLeft + offset, outerWidth - bodyWidth)
                        }
                    } else {
                        this.tagBodyLeft = 0
                    }
                }
            },
            handleTagsOption (type) {
                if (type.includes('all')) {
                    const res = this.list.filter(item => item.path === this.homePath)
                    this.$emit('on-close', res, 'all')
                } else if (type.includes('others')) {
                    const res = this.list.filter(item => item.path === this.fullPath || item.path === this.homePath)
                    this.$emit('on-close', res, 'others')
                    this.focusTagElementByFullPath(this.fullPath)
                }
            },
            handleClose (current) {
                if (current.path !== this.fullPath) {
                    this.handleClick(current)
                } else {
                    this.close(current.path, this.showTitleInside(current))
                }
            },
            close (path, pageName) {
                const res = this.list.filter(item => item.path !== path)
                const currIndex = this.list.findIndex(item => item.path === path)
                let nextPath = this.homePath
                if (currIndex === this.list.length - 1) {
                    nextPath = this.list[this.list.length - 2].path
                } else {
                    nextPath = this.list[currIndex + 1].path
                }
                this.$emit('on-close', res, undefined, nextPath, pageName)
            },
            handleClick (item) {
                this.$emit('input', item.path)
            },
            showTitleInside (item) {
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
            isCurrentTag (item) {
                return this.fullPath === item.path
            },
            moveToView (tag) {
                const outerWidth = this.$refs.scrollOuter.offsetWidth
                const bodyWidth = this.$refs.scrollBody.offsetWidth
                if (bodyWidth < outerWidth) {
                    this.tagBodyLeft = 0
                } else if (tag.offsetLeft < -this.tagBodyLeft) {
                    // 标签在可视区域左侧
                    this.tagBodyLeft = -tag.offsetLeft + this.outerPadding
                } else if (tag.offsetLeft > -this.tagBodyLeft && tag.offsetLeft + tag.offsetWidth < -this.tagBodyLeft + outerWidth) {
                    // 标签在可视区域
                    this.tagBodyLeft = Math.min(0, outerWidth - tag.offsetWidth - tag.offsetLeft - this.outerPadding)
                } else {
                    // 标签在可视区域右侧
                    this.tagBodyLeft = -(tag.offsetLeft - (outerWidth - this.outerPadding - tag.offsetWidth))
                }
            },
            focusTagElementByFullPath (fullPath) {
                this.$nextTick(() => {
                        this.refsTag = this.$refs.tagsPageOpened
                        if (this.refsTag && this.refsTag.length > 0) {
                            this.refsTag.forEach((item, index) => {
                                if (item.$attrs['data-route-item'].path === fullPath) {
                                    this.moveToView(this.refsTag[index].$el)
                                }
                            })
                        }
                    }
                )
            },
            contextMenu (item, e) {
                this.visible = true
                const offsetLeft = this.$el.getBoundingClientRect().left
                this.contextMenuLeft = e.clientX - offsetLeft + 10
                this.contextMenuTop = e.clientY - 64
            },
            closeMenu () {
                this.visible = false
            }
        },
        watch: {
            '$route' (to) {
                this.focusTagElementByFullPath(to.fullPath)
            },
            visible (value) {
                if (value) {
                    document.body.addEventListener('click', this.closeMenu)
                } else {
                    document.body.removeEventListener('click', this.closeMenu)
                }
            }
        },
        mounted () {
            this.focusTagElementByFullPath(this.fullPath)
        }
    }
</script>

<style lang="less">
  @import './tags-nav.less';
</style>
