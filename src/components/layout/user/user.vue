<template>
  <div class="user-avatar-dropdown">
    <el-dropdown trigger="click" @command="handleClick" popper-class="dropdown-menu-content">
      <el-avatar :src="avatar" style="margin-top: 10px" :size="40"/>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-if="customerName && customerName !== ''" command="personalInformation">
            <el-icon>
              <el-icon-user/>
            </el-icon>
            {{ customerName }}
          </el-dropdown-item>
          <el-dropdown-item v-else command="personalInformation">
            <el-icon>
              <el-icon-avatar/>
            </el-icon>
            {{ $t('home.personalInformation') }}
          </el-dropdown-item>
          <el-dropdown-item command="home" :divided="true">
            <el-icon>
              <el-icon-home-filled/>
            </el-icon>
            {{ $t('pageTitle.home') }}
          </el-dropdown-item>
          <el-dropdown-item command="fullScreen">
            <el-icon>
              <el-icon-full-screen/>
            </el-icon>
            {{ isFullscreen() ? $t('home.exitFullScreen') : $t('home.fullScreen') }}
          </el-dropdown-item>
          <el-dropdown-item v-if="isSupper" command="logFile" :divided="true">
            <el-icon>
              <el-icon-document/>
            </el-icon>
            {{ $t('pageTitle.logFile') }}
          </el-dropdown-item>
          <el-dropdown-item v-if="isSupper" command="routeLog">
            <el-icon>
              <el-icon-reading/>
            </el-icon>
            {{ $t('pageTitle.routeLog') }}
          </el-dropdown-item>
          <el-dropdown-item v-if="isSupper" command="routeConfig">
            <el-icon>
              <el-icon-share/>
            </el-icon>
            {{ $t('pageTitle.routeConfig') }}
          </el-dropdown-item>
          <el-dropdown-item v-if="isSupper" command="deploy">
            <el-icon>
              <el-icon-tools/>
            </el-icon>
            {{ $t('pageTitle.deploy') }}
          </el-dropdown-item>
          <el-dropdown-item command="logout" :divided="true">
            <el-icon>
              <el-icon-delete-filled/>
            </el-icon>
            {{ $t('home.logout') }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script>
import avatarImg from '@/assets/images/avatar/avatar.jpg'
import './user.less'

export default {
  name: 'User',
  props: {
    customerName: {
      type: String,
      default: ''
    },
    userAvatar: {
      type: String,
      default: avatarImg
    }
  },
  computed: {
    isSupper() {
      return this.$store.state.app.user.userInfo.levels <= 0
    },
    avatar() {
      if (this.userAvatar && this.userAvatar !== '') {
        return this.userAvatar
      } else {
        return avatarImg
      }
    }
  },
  methods: {
    isFullscreen() {
      return !!(document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen)
    },
    logout() {
      this.$api.redirectLogin((callBackFunc) => {
        this.$confirm(this.$i18n.t('messages.logoutConfirm'), this.$i18n.t('dialog.confirm'), {
          type: 'warning'
        }).then(() => {
          this.$api.request.auth.doLogOut().then(() => {
            callBackFunc()
          })
        }).catch(() => {
        })
      })
    },
    personalInformation() {
      this.$api.gotoPersonalInformation()
    },
    handleClick(name) {
      switch (name) {
        case 'personalInformation':
          this.personalInformation()
          break
        case 'home':
          this.$api.redirectHome()
          break
        case 'fullScreen':
          this.handleFullscreen()
          break
        case 'logFile':
          this.$api.gotoLogFile()
          break
        case 'routeLog':
          this.$api.gotoRouteLog()
          break
        case 'routeConfig':
          this.$api.gotoRouteConfig()
          break
        case 'deploy':
          this.$api.gotoDeploy()
          break
        case 'logout':
          this.logout()
          break
      }
    },
    handleFullscreen() {
      const main = document.body
      if (this.isFullscreen()) {
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
    }
  }
}
</script>
