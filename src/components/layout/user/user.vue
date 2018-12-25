<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <Avatar v-if="userAvator && userAvator !== ''" :src="userAvator"/>
      <Avatar v-else icon="ios-person"/>
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
        default: ''
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
        this.$api.redirectPersonalInformation()
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
