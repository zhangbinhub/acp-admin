<template>
  <Dropdown ref="dropdown" @on-click="handleClick" :class="isRoot ? '' : 'collased-menu-dropdown'"
            :transfer="isRoot" :placement="placement">
    <a class="drop-menu-a" type="text" @mouseover="handleMousemove($event, children)"
       :style="{textAlign: !hideTitle ? 'left' : ''}">
      <Icon :type="parentItem.icon_type" :size="rootIconSize"></Icon>
      <span class="menu-title" v-if="!hideTitle">{{ parentItem.name }}</span>
      <Icon style="float: right;" v-if="!hideTitle" type="ios-arrow-forward" :size="iconSize"/>
    </a>
    <DropdownMenu ref="dropdown" slot="list">
      <template v-for="child in children">
        <collapsed-menu v-if="child.children && child.children.length > 0" :icon-size="iconSize" :parent-item="child"
                        :key="`drop-${child.id}`" :hide-title="false"></collapsed-menu>
        <DropdownItem v-else :key="`drop-${child.id}`" :name="child.path">
          <Icon :type="child.icon_type" :size="iconSize"></Icon>
          <span class="menu-title">{{ child.name }}</span>
        </DropdownItem>
      </template>
    </DropdownMenu>
  </Dropdown>
</template>
<script>
  import { findNodeUpperByClasses } from '@/libs/tools'

  export default {
    name: 'CollapsedMenu',
    props: {
      parentItem: {
        type: Object,
        default: () => {
        }
      },
      hideTitle: {
        type: Boolean,
        default: false
      },
      isRoot: {
        type: Boolean,
        default: false
      },
      rootIconSize: {
        type: Number,
        default: 16
      },
      iconSize: {
        type: Number,
        default: 16
      }
    },
    data () {
      return {
        placement: 'right-end'
      }
    },
    computed: {
      children () {
        return this.parentItem.children
      }
    },
    methods: {
      handleClick (path) {
        this.$emit('on-click', path)
      },
      handleMousemove (event, children) {
        const { pageY } = event
        const height = children.length * 38
        const isOverflow = pageY + height < window.innerHeight
        this.placement = isOverflow ? 'right-start' : 'right-end'
      }
    },
    mounted () {
      let dropdown = findNodeUpperByClasses(this.$refs.dropdown.$el, ['ivu-select-dropdown', 'ivu-dropdown-transfer'])
      if (dropdown) dropdown.style.overflow = 'visible'
    }
  }
</script>
