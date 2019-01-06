<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <Avatar :src="avatar"/>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem v-if="customerName && customerName !== ''" name="personalInformation">{{customerName}}
        </DropdownItem>
        <DropdownItem v-else name="personalInformation">{{$t('home.personalInformation')}}</DropdownItem>
        <DropdownItem name="logout" divided>{{$t('home.logout')}}</DropdownItem>
      </DropdownMenu>
    </Dropdown>
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
      userAvator: {
        type: String,
        default: avatarImg
      }
    },
    computed: {
      avatar () {
        if (this.userAvator !== '') {
          return this.userAvator
        } else {
          return avatarImg
        }
      }
    },
    methods: {
      logout () {
        this.$Modal.confirm({
          title: this.$i18n.t('dialog.confirm'),
          content: '<p>' + this.$i18n.t('messages.logoutConfirm') + '</p>',
          onOk: () => {
            this.$api.redirectLogin()
          }
        })
      },
      personalInformation () {
        this.$api.gotoPersonalInformation()
      },
      handleClick (name) {
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
