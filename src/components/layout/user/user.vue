<template>
  <div class="user-avatar-dropdown">
    <el-dropdown trigger="click" @command="handleClick">
      <el-avatar :src="avatar" style="margin-top: 10px"/>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-if="customerName && customerName !== ''" command="personalInformation">{{ customerName }}
          </el-dropdown-item>
          <el-dropdown-item v-else command="personalInformation">{{ $t('home.personalInformation') }}</el-dropdown-item>
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
        case 'logout':
          this.logout()
          break
        case 'personalInformation':
          this.personalInformation()
          break
      }
    }
  }
}
</script>
