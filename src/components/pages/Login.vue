<template>
  <div class="login">
    <div class="bg">
      <Modal class="login-modal" v-model="loginModal" width="360" :closable="false" :mask-closable="false">
        <div slot="header" style="text-align: center;">
          <h1 style="margin:10px;">
            <Row type="flex" justify="center" align="middle" style="text-align: center;">
              <Col span="24">
                <span style="color: #657180;">{{title}}</span>
                <span style="text-align: center;font-size: x-small;color: #c5c8ce;">&nbsp;V{{version}}</span>
              </Col>
            </Row>
          </h1>
        </div>
        <div>
          <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-position="right" :label-width="80">
            <FormItem :label="text.username" prop="username">
              <Input v-model="formValidate.username" type="text" :placeholder="text.usernamePlaceholder"/>
            </FormItem>
            <FormItem :label="text.password" prop="password">
              <Input v-model="formValidate.password" type="password"
                     :placeholder="text.passwordPlaceholder"
                     @keyup.native.enter="handleSubmit('formValidate')"/>
            </FormItem>
            <FormItem style="margin-bottom: 0;">
              <Checkbox v-model="formValidate.remember">
                {{text.rememberMe}}
              </Checkbox>
            </FormItem>
          </Form>
        </div>
        <div slot="footer">
          <Button type="primary" size="large" long :loading="modal_loading" @click="handleSubmit('formValidate')">
            {{$t('loginForm.buttons.login')}}
          </Button>
          <small style="text-align: center;display:block">{{copyright}}</small>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'login',
    data () {
      return {
        title: this.$store.state.app.appInfo.appName,
        version: this.$store.state.app.appInfo.appVersion,
        copyright: this.$store.state.app.appInfo.copyright,
        text: {
          username: this.$i18n.t('loginForm.username'),
          usernamePlaceholder: this.$i18n.t('loginForm.usernamePlaceholder'),
          password: this.$i18n.t('loginForm.password'),
          passwordPlaceholder: this.$i18n.t('loginForm.passwordPlaceholder'),
          rememberMe: this.$i18n.t('loginForm.rememberMe')
        },
        loginModal: true,
        modal_loading: false,
        formValidate: {
          username: this.$store.state.app.userInfo.username,
          password: '',
          remember: this.$store.state.app.userInfo.remember
        },
        ruleValidate: {
          username: [
            { required: true, message: this.$i18n.t('loginForm.usernameValidate'), trigger: 'blur' }
          ],
          password: [
            { required: true, message: this.$i18n.t('loginForm.passwordValidate'), trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      handleSubmit (name) {
        const currObj = this
        currObj.$refs[name].validate((valid) => {
          if (valid) {
            currObj.modal_loading = true
            currObj.$api.request.login(currObj.formValidate.username, currObj.formValidate.password).then(res => {
              if (res) {
                currObj.modal_loading = false
                currObj.$Message.success(currObj.$i18n.t('messages.loginSuccess'))
                currObj.$store.commit('SET_TOKEN', res.data.access_token)
                currObj.$store.commit('SET_TOKEN_TYPE', res.data.token_type)
                currObj.$store.commit('SET_SCOPE', res.data.scope)
                if (currObj.formValidate.remember) {
                  currObj.$store.commit('SET_USERNAME', currObj.formValidate.username)
                } else {
                  currObj.$store.commit('SET_USERNAME', '')
                }
                currObj.$store.commit('SET_REMEMBER', currObj.formValidate.remember)
                currObj.$router.push('/')
              }
            }).catch(() => {
                currObj.modal_loading = false
                currObj.$api.errorProcess(currObj.$i18n.t('messages.loginInvalid'), currObj.$i18n.t('messages.loginFailed'))
              }
            )
          }
        })
      }
    }
  }
</script>
