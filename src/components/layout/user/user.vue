<template>
  <div class="user-avatar-dropdown">
    <el-dropdown trigger="click" @command="handleClick" popper-class="dropdown-menu-content">
      <el-avatar :src="avatar" style="margin-top: 10px" :size="40"/>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-if="customerName && customerName !== ''" command="personalInformation">
            {{ customerName }}
          </el-dropdown-item>
          <el-dropdown-item v-else command="personalInformation">{{ $t('home.personalInformation') }}</el-dropdown-item>
          <el-dropdown-item v-if="isSupper" command="logFile" :divided="true">
            {{ $t('pageTitle.logFile') }}
          </el-dropdown-item>
          <el-dropdown-item v-if="isSupper" command="routeLog">
            {{ $t('pageTitle.routeLog') }}
          </el-dropdown-item>
          <el-dropdown-item v-if="isSupper" command="routeConfig">
            {{ $t('pageTitle.routeConfig') }}
          </el-dropdown-item>
          <el-dropdown-item v-if="isSupper" command="deploy">
            {{ $t('pageTitle.deploy') }}
          </el-dropdown-item>
          <el-dropdown-item command="logout" :divided="true">{{ $t('home.logout') }}</el-dropdown-item>
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
    }
  }
}
</script>
