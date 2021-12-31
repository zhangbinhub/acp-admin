<template>
  <div v-if="showFullScreenBtn" class="header-bar-button">
    <el-tooltip v-if="!isMobile" :content="modelValue ? $t('home.exitFullScreen') : $t('home.fullScreen')"
                placement="bottom">
      <el-button type="text" @click="handleChange">
        <el-icon size="23">
          <el-icon-full-screen/>
        </el-icon>
      </el-button>
    </el-tooltip>
    <el-button v-else type="text" @click="handleChange">
      <el-icon size="23">
        <el-icon-full-screen/>
      </el-icon>
    </el-button>
  </div>
</template>

<script>
export default {
  name: 'Fullscreen',
  computed: {
    showFullScreenBtn() {
      return window.navigator.userAgent.indexOf('MSIE') < 0
    }
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleFullscreen() {
      let main = document.body
      if (this.modelValue) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
      } else {
        if (main.requestFullscreen) {
          main.requestFullscreen()
        } else if (main.mozRequestFullScreen) {
          main.mozRequestFullScreen()
        } else if (main.webkitRequestFullScreen) {
          main.webkitRequestFullScreen()
        } else if (main.msRequestFullscreen) {
          main.msRequestFullscreen()
        }
      }
    },
    handleChange() {
      this.handleFullscreen()
    }
  },
  mounted() {
    let isFullscreen = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen
    isFullscreen = !!isFullscreen
    document.addEventListener('fullscreenchange', () => {
      this.$emit('update:modelValue', !this.modelValue)
      this.$emit('on-change', !this.modelValue)
    })
    document.addEventListener('mozfullscreenchange', () => {
      this.$emit('update:modelValue', !this.modelValue)
      this.$emit('on-change', !this.modelValue)
    })
    document.addEventListener('webkitfullscreenchange', () => {
      this.$emit('update:modelValue', !this.modelValue)
      this.$emit('on-change', !this.modelValue)
    })
    document.addEventListener('msfullscreenchange', () => {
      this.$emit('update:modelValue', !this.modelValue)
      this.$emit('on-change', !this.modelValue)
    })
    document.addEventListener('MSFullscreenChange', () => {
      this.$emit('update:modelValue', !this.modelValue)
      this.$emit('on-change', !this.modelValue)
    })
    this.$emit('update:modelValue', isFullscreen)
  }
}
</script>
